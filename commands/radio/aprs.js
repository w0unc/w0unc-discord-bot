'use strict';


// Imports 'Command' from the Sapphire library.
const { Command } = require('@sapphire/framework');


// Imports the APICall module.
const APICall = require('../../modules/APICall');


// Command that gets information on an APRS packet.
module.exports = class APRS extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'aprs',
			description: 'Gets information on an APRS packet.',
			cooldownDelay: 5_000
		});
	}

	// The main run function of the APRS command.
	async messageRun(message, args) {
		// Returns if the APRS API key is missing.
		if (!this.container.client.config.aprsAPIKey) {
			message.reply([
				'An error occurred while running the command: `APRS`',
				'You shouldn\'t ever receive an error like this.',
				`Please contact ${this.container.client.owners || 'the bot owner'}`,
				`${this.container.client.config.invite ? `In this server: https://discord.gg/${this.container.client.config.invite}` : '.'}`,
			].join('\n'));

			// Log the error.
			return this.container.client.logger.log('APRS API key is missing.', 'error');
		}

		// Arguments.
		const criteria = await args.pick('string').catch(() => { return message.reply('Please specify an APRS packet identifier.') });
		const searchCriteria = criteria.toUpperCase();

		// Criteria validation.
		if (searchCriteria < 1 || searchCriteria > 10) {
			return message.reply('Criteria must be between 1 and 10 characters.');
		}

		// API call options.
		const options = {
			host: 'api.aprs.fi',
			path: `/api/get?format=json&what=loc&apikey=${this.container.client.config.aprsAPIKey}&name=${searchCriteria}`,
		};

		// API call.
		APICall.call(options, (err, res) => {
			if (err) {
				// Reply to the user if error.
				message.reply([
					'An error occurred while running the command: `APRS`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.container.client.owners || 'the bot owner'}`,
					`${this.container.client.config.invite ? `In this server: https://discord.gg/${this.container.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.container.client.logger.log(err, 'error');
			}

			// Parse the data into JSON.
			let data = JSON.parse(res);

			// Reply to the user if error.
			if (data.code === 'apikey-invalid' || data.code === 'apikey-wrong') {
				// Reply to the user if error.
				msg.reply([
					'An error occurred while running the command: `APRS`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.container.client.owners || 'the bot owner'}`,
					`${this.container.client.config.invite ? `In this server: https://discord.gg/${this.container.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.container.client.logger.log('Invalid APRS API Key', 'error');
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
			message.reply([
				'\`\`\`asciidoc',
				`${aprs}`,
				'\`\`\`',
			].join('\n'));
		});
	}
};
