'use strict';


// Imports the Node.js HTTPS library.
const https = require('https');


// Imports the Node.js HTTP library.
const http = require('http');


// Handles the API calls.
class APICall {
	static async call(options, callback) {
		const call = () => {
			// Switch between the HTTPS and HTTP library.
			let api = https;
			if (options.encryption === false) {
				api = http;
			}

			// API call.
			api.get(options, res => {
				let data = '';

				res.on('data', chunk => {
					data += chunk;
				});

				res.on('end', () => {
					callback(null, data, res.statusCode, res.statusMessage);
				});

			}).on('error', err => {
				// Return if error.
				callback(err, null);
			});
		};

		const results = res => {
			return res;
		};

		// Run the call.
		call(results);
	}
}


module.exports = APICall;
