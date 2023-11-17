/**
 * Main file for the FTPBackup Program.
 */
let FTPBackup = require('./lib/ftpbackup/FTPBackup.js');

//Create a new instance of the object
let fB = new FTPBackup();

//Check to see if we recieved an input file
if((process.argv).length === 2)
{
	//No command line argument, start process with asking for credentials
	fB.doBackupWithUserInput();
}

else
{
	//Send in the argument as a file
	fB.doBackupsFromFile(process.argv[2]);
}
