/**
 * File for the BackupSystem class.
 */
let ftp = require('basic-ftp');
let fs = require('fs');

class BackupSystem
{
	/**
	 * Main consturctor for the BackupSystem class.
	 */
	constructor(ftpbackup)
	{
		let self = this;
		self.ftpbackup = ftpbackup;
	}

	/**
	 * Function to backup an account.
	 */
	async backupAccount(acc, callbackfunction)
	{
		let self = this;

		let client = new ftp.Client();
		(client.ftp).verbose = true;

		try
		{
			await client.access(acc); 

			console.log(await client.list());
		}

		catch(err)
		{
			console.error(err);
			process.exit(1);
		}
	}

};

module.exports = BackupSystem;

