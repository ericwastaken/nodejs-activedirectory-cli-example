# Example Active Directory Authentication

This example demonstrates how to authenticate users using Active Directory.

## Prerequisites

- An Active Directory server
- A user account in the Active Directory server
- A password for the user account

## Running the example

1. Create a .env file using the structure in the template.env file provided.
2. Fill in the required values in the .env file.
3. Run the example using the following command:

```bash
node ad-auth.js --username [username-here]
```

Replace `[username-here]` with the user account you want to authenticate INCLUDING the @domain.com part. If you use the short domain format (i.e. DOMAINNAME\username), the script will reformat the username into the full domain format.

For example:
* someuser@yourdomain.com - will be used as passed
* someuser@yourdomain.local - will be used as passed
* YOURDOMAINNAME\someuser - will be reformatted to someuser@yourdomainname.com (or whatever domain string is in the .env file)

> **Note:** When using the short domain format, depending on your command line, you might need to quote the username. For example: `node ad-auth.js --username "YOURDOMAINNAME\someuser"`.

The script will prompt you to enter the password for the user account.

```text
Enter password for youruser@yourdomain.com: 
***********

Authenticated!
Groups for User: youruser@yourdomain.com ➞ [{"dn":"CN=someGroupName,CN=Users,DC=yourdomain,DC=com","cn":"someGroupName","distinguishedName":"CN=someGroupName,CN=Users,DC=yourdomain,DC=com","objectCategory":"CN=Group,CN=Schema,CN=Configuration,DC=yourdomain,DC=com"}]
```

## Output

The example will output the user's information if the authentication is successful, including the user groups they belong to.

## What's the point of this example?

This example demonstrates how to authenticate users using Active Directory. It shows how to connect to an Active Directory server, authenticate a user, and retrieve the groups the user belongs to. The `ad-auth.js` demonstrates a way to do this. It's not mean to be used in production, but rather as a starting point for your own implementation.

## Troubleshooting

- If you encounter any issues, please check the values in the .env file and ensure they are correct.
- Make sure the user account exists in the Active Directory server and the password is correct.
- Check the network connectivity to the Active Directory server.
- Verify the LDAP server settings in the .env file.
- Ensure the user account has the necessary permissions to authenticate and retrieve group information.
- Check the LDAP filter and base DN settings in the .env file.
- If you are still facing issues, consult the Active Directory server administrator for assistance.

## Known Issues

- None





