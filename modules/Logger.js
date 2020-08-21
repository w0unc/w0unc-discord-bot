'use strict';


// Imports the Node.js file system library.
const fs = require('fs');


// Imports the Moment.js library.
const moment = require('moment');


// Handles the bot logging.
class Logger {
	static log(content, type) {
		// Return if the log type is not set.
		if (!type) { throw new ReferenceError; }

		// Log time formatted.
		const time = moment().utc().format('YY-MMM-DD HH:mm:ss:SS');

		// Log formatted.
		const log = `[${time}] (${type.toUpperCase()}) ${content}`;

		// Sends the log to a file.
		fs.appendFile('./logs/bot.txt', `${log}\n`, err => {
			if (err) { throw err; }

			// Sends the log to the console.
			console.log(log);
		});
	}
}


module.exports = Logger;
