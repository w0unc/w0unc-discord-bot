'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports the APICall module.
const APICall = require('../../modules/APICall');


// Command that returns if it is raining in an area.
module.exports = class IsItRaining extends Command {
	constructor(client) {
		super(client, {
			name: 'isitraining',
			group: 'tools',
			memberName: 'isitraining',
			description: 'Returns if it is raining in an area.',
			examples: [
				'isitraining New York',
				'isitraining 28223',
				'isitraining EGLL',
				'isitraining DXB',
			],
			throttling: {
				usages: 1,
				duration: 10,
			},
			args: [
				{
					key: 'location',
					prompt: 'Please specify a location to see if it is raining.',
					type: 'string',
					max: 50,
					min: 1,
				},
			],
		});
	}

	// The main run function of the IsItRaining command.
	async run(msg, { location }) {
		// Returns if the HEAR API key is missing.
		if (!this.client.config.hereAPIKey) {
			msg.reply([
				'An error occurred while running the command: `IsItRaining`',
				'You shouldn\'t ever receive an error like this.',
				`Please contact ${this.client.owners || 'the bot owner'}`,
				`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : '.'}`,
			].join('\n'));

			// Log the error.
			this.client.logger.log('HERE API key is missing.', 'error');
		}

		// API call options.
		const options = {
			host: 'weather.ls.hereapi.com',
			path: `/weather/1.0/report.json?product=observation&name=${encodeURI(location)}&apiKey=${this.client.config.hereAPIKey}`,
			encryption: true,
		};

		// API call.
		APICall.call(options, (err, result, statusCode) => {
			if (err || statusCode === 404) {
				// Reply to the user if error.
				console.log(this.client.config);
				msg.reply([
					'An error occurred while running the command: `IsItRaining`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.client.owners || 'the bot owner'}`,
					`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.client.logger.log(err, 'error');
			}

			// Parse the data into JSON.
			const data = JSON.parse(result);

			// Reply to the user if error.
			if (data.Type === 'Invalid Request') {
				return msg.reply('Invalid Request');
			}

			// Reply to the user.
			if (data.observations.location[0].observation[0].precipitationDesc === '') {
				msg.reply('No');
			}
			else {
				msg.reply('Yes');
			}
		});
	}
};
