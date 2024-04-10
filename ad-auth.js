const ActiveDirectory = require('activedirectory2');
const { program } = require('commander');
require('dotenv').config();
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const util = require('util');

// Configure Active Directory settings, from environment variables
const config = {
  url: process.env.LDAP_HOST,
  baseDN: process.env.LDAP_BASE_DN,
  username: process.env.LDAP_QUERY_USER,
  password: process.env.LDAP_QUERY_PASSWORD
};
const ad = new ActiveDirectory(config);

// Parse command line arguments
program
  .version('0.0.1')
  .requiredOption('-u, --username [username]', 'Username')
  .parse(process.argv);
const options = program.opts();

// Utilize promisify to wrap the callback-based authenticate and getGroupMembershipForUser methods
const authenticateAsync = util.promisify(ad.authenticate.bind(ad));
const getGroupMembershipForUserAsync = util.promisify(ad.getGroupMembershipForUser.bind(ad));

/**
 * Prompt for password securely
 *
 * @param username
 * @returns {Promise<unknown>}
 */
const promptForPassword = async (username) => {
  return new Promise((resolve) => {
    console.log(`Enter password for ${username}: `);
    input.setRawMode(true);
    input.resume();
    readline.emitKeypressEvents(input);

    let password = '';
    const listener = (str, key) => {
      if (key.sequence === '\u0003') { // CTRL+C to exit
        process.exit();
      } else if (key.name === 'return') {
        input.setRawMode(false);
        input.pause();
        input.removeListener('keypress', listener);
        console.log('\n'); // Move to new line after password entry
        resolve(password);
      } else if (key.name === 'backspace') {
        password = password.slice(0, -1);
        output.write('\b \b');
      } else {
        password += str;
        output.write('*');
      }
    };

    input.on('keypress', listener);
  });
};

/**
 * Authenticate user and fetch group membership
 *
 * @returns {Promise<number>}
 */
const authenticateUser = async () => {
  const username = options.username;
  try {
    const password = await promptForPassword(username); // Ensure promptForPassword is correctly implemented to handle input securely
    const auth = await authenticateAsync(username, password);
    if (auth) {
      console.log('Authenticated!');
      try {
        const groups = await getGroupMembershipForUserAsync(username);
        if (!groups) {
          console.log(`User: ${username} not found.`);
          return 1;
        } else {
          console.log(`Groups for User: ${username} ➞ ${JSON.stringify(groups)}`);
          return 0;
        }
      } catch (err) {
        console.error('ERROR fetching groups:', JSON.stringify(err));
        return 2;
      }
    } else {
      console.log('Authentication failed!');
      return 10;
    }
  } catch (err) {
    console.error('ERROR during authentication:', JSON.stringify(err));
    return 100
  }
};

/**
 * Main entry point
 */
authenticateUser().then((errCode) => {
  input.setRawMode(false);
  input.pause(); // Ensure the process can exit by not listening anymore
  process.exit(errCode); // Explicitly exit the process
});
