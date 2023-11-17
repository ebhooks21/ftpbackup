/**
 * File for the FTPBackup class.
 */
let readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
let mkdirp = require('mkdirp');
let os = require('os');
let BackupSystem = require('../backupsystem/BackupSystem.js');

class FTPBackup
{
	/**
	 * Main constructor for the FTPBackup class.
	 */
	constructor()
	{
		let self = this;
		self.backupAccounts = [];
		self.backupSys = new BackupSystem(self);
	}

	/**
	 * Function to output a line of text.
	 */
	outputLineOfText(line)
	{
		console.log(os.EOL);
		console.log(line);
	}

	/**
	 * Function to do the backup with user input.
	 */
	doBackupWithUserInput()
	{
		let self = this;
		let backupAccount = {
			host: "",
			user: "",
			password: "",
			port: 21,
			secure: true,
			secureOptions: {
				rejectUnauthorized: false
			}
		};

		//Get the URL first
		self.getURLFromUserInput(function(url)
		{
			backupAccount.host = url;

			//Get the username
			self.getUsernameFromUserInput(function(username)
			{
				backupAccount.user = username;

				//Get the password
				self.getPasswordFromUserInput(function(password)
				{
					backupAccount.password = password;

					//Push the backup account
					(self.backupAccounts).push(backupAccount);

					//Peform the backup
					self.performBackups();
				});
			});
		});
	}

	/**
	 * Function to get the URL/IP from the user interface.
	 */
	getURLFromUserInput(callbackfunction)
	{
		let self = this;

		readline.question("Please enter the server URL/IP: ", function(url)
		{
			if((url != null) && (url.length > 0))
			{
				callbackfunction(url);
			}

			else
			{
				self.getURLFromUserInput(callbackfunction);
			}
		});
	}

	/**
	 * Function to get the username from the user interface.
	 */
	getUsernameFromUserInput(callbackfunction)
	{
		let self = this;

		readline.question("Please enter the server username: ", function(username)
		{
			if((username != null) && (username.length > 0))
			{
				callbackfunction(username);
			}

			else
			{
				self.getURLFromUserInput(callbackfunction);
			}
		});
	}

	/**
	 * Function to get the password from the user interface.
	 */
	getPasswordFromUserInput(callbackfunction)
	{
		let self = this;

		readline.question("Please enter the server password: ", function(password)
		{
			if((password != null) && (password.length > 0))
			{
				callbackfunction(password);
			}

			else
			{
				self.getURLFromUserInput(callbackfunction);
			}
		});
	}

	/**
	 * Function to perform the backups.
	 */
	performBackups()
	{
		let self = this;
		let numAccounts = (self.backupAccounts).length;

		self.outputLineOfText(numAccounts + " accounts to backup...");

		//Loop through the accounts and back each one up
		for(let acc in self.backupAccounts)
		{
			self.performBackup(self.backupAccounts[acc], function()
			{
			});
		}
	}

	/**
	 * Function to perform the backup.
	 */
	performBackup(acc, callbackfunction)
	{
		let self = this;

		self.outputLineOfText("Backing Up: " + acc.host);

		//Create the directory to store the files in
		mkdirp.sync('../Temp/' + acc.host);	
			(self.backupSys).backupAccount(acc, function()
			{
			});
	}
};

module.exports = FTPBackup;
