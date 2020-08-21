'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports the APICall module.
const APICall = require('../../modules/APICall');


// Command that gets information on an APRS packet.
module.exports = class APRS extends Command {
	constructor(client) {
		super(client, {
			name: 'aprs',
			group: 'radio',
			memberName: 'aprs',
			description: 'Gets information on an APRS packet.',
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'criteria',
					prompt: 'Please specify an APRS packet identifier.',
					type: 'string',
					max: 10,
					min: 1,
				},
			],
		});
	}

	// The main run function of the APRS command.
	async run(msg, { criteria }) {
		// Returns if the APRS API key is missing.
		if (!this.client.config.aprsAPIKey) {
			msg.reply([
				'An error occurred while running the command: `APRS`',
				'You shouldn\'t ever receive an error like this.',
				`Please contact ${this.client.owners || 'the bot owner'}`,
				`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : '.'}`,
			].join('\n'));

			// Log the error.
			return this.client.logger.log('APRS API key is missing.', 'error');
		}

		criteria = criteria.toUpperCase();

		// API call options.
		const options = {
			host: 'api.aprs.fi',
			path: `/api/get?format=json&what=loc&apikey=${this.client.config.aprsAPIKey}&name=${criteria}`,
		};

		// API call.
		APICall.call(options, (err, res) => {
			if (err) {
				// Reply to the user if error.
				msg.reply([
					'An error occurred while running the command: `APRS`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.client.owners || 'the bot owner'}`,
					`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.client.logger.log(err, 'error');
			}

			// Parse the data into JSON.
			let data = JSON.parse(res);

			// Reply to the user if error.
			if (data.code === 'apikey-invalid' || data.code === 'apikey-wrong') {
				// Reply to the user if error.
				msg.reply([
					'An error occurred while running the command: `APRS`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.client.owners || 'the bot owner'}`,
					`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.client.logger.log('Invalid APRS API Key', 'error');
			}

			// Reply to the user if error.
			if (data.found === 0) {
				return msg.reply('There were no results found given that criteria.');
			}

			// Gets the longest key from the JSON.
			data = data.entries[0];
			const longest = Object.keys(data).reduce((long, str) => Math.max(long, str.length), 0);

			// Formats the data.
			let aprs = '';
			for (const key in data) {
				aprs += `• ${key}${' '.repeat(longest - key.length)} :: ${data[key]}\n`;
			}

			// Reply to the user.
			msg.reply(aprs, { code: 'asciidoc' });
		});
	}
};
