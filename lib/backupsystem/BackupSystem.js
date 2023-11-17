/**
 * File for the BackupSystem class.
 */
let ftp = require('basic-ftp');
let mkdirp = require('mkdirp');
let tar = require('@popovmp/tar'); 
let gzip = require('zlib'); 
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

			if(fs.existsSync('../Temp/' + acc.host))
			{
				await client.downloadToDir('../Temp/' + acc.host);	
				client.close();

				(self.ftpbackup).outputLineOfText("Finished downloading files, continuing to compression...");

				self.compressBackedUpFiles(acc, callbackfunction);
			}

			else
			{
				console.error("Folder for " + acc.host + " does not exist.");
				process.exit(1);
			}
		}

		catch(err)
		{
			console.error(err);
			process.exit(1);
		}
	}

	/**
	 * Function to compress the downloaded files.
	 */
	compressBackedUpFiles(acc, callbackfunction)
	{
		let self = this;

		let path = "../Temp/" + acc.host;

		let tarFile = tar.create(path);

		let tarGzFile = gzip.gzipSync(tarFile);

		fs.writeFileSync("../../../Temp/finishedbackup.tar.gz", tarGzFile);

		callbackfunction();
	}
};

module.exports = BackupSystem;

