/**
 * File for the BackupSystem class.
 */
let Client = require('ftp');
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

		let client = new Client();

		try
		{
			if(fs.existsSync('../Temp/' + acc.host))
			{
				client.on('ready', function()
				{
					self.performFTPBackup(client, function()
					{
						client.end();
						client = null;

						(self.ftpbackup).outputLineOfText("Finished downloading files, continuing to compression...");
					});	
				});

				client.connect(acc);
				//await client.downloadToDir('../Temp/' + acc.host);	


				//self.compressBackedUpFiles(acc, callbackfunction);
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
	 * Function to perform the FTP backup.
	 */
	performFTPBackup(client, callbackfunction)
	{
		let self = this;

		client.list(function(err, list)
		{
			if(err)
			{
				console.error(err);
				throw err;
			}

			else
			{
				for(let en in list)
				{
					console.log(list[en]);
				}

				callbackfunction();
			}
		});
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

