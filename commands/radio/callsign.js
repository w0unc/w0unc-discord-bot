'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports 'MessageEmbed' from the Discord.js library.
const { MessageEmbed } = require('discord.js');


// Imports the APICall module.
const APICall = require('../../modules/APICall');


// Command that gets information on an FCC call sign.
module.exports = class CALLSIGN extends Command {
	constructor(client) {
		super(client, {
			name: 'callsign',
			aliases: ['callsign', 'csign', 'ham', 'operator'],
			group: 'radio',
			memberName: 'callsign',
			description: 'Gets information on an FCC call sign.',
			throttling: {
				usages: 1,
				duration: 10,
			},
			args: [
				{
					key: 'criteria',
					prompt: 'Please specify a call sign.',
					type: 'string',
					max: 50,
					min: 1,
				},
			],
		});
	}

	// The main run function of the CALLSIGN command.
	async run(msg, { criteria }) {
		// Reply to the user if the call sign contains invalid characters.
		if (criteria.match(/[^\w]/gi)) {
			return msg.reply('That call sign contains invalid characters.');
		}

		criteria = criteria.toUpperCase();

		// For sending a RichEmbed message.
		const sendEmbed = new MessageEmbed();

		// API call options.
		const options = {
			host: 'callook.info',
			path: `/${criteria}/json`,
		};

		// API call.
		APICall.call(options, (err, result) => {
			if (err) {
				// Reply to the user if error.
				msg.reply([
					'An error occurred while running the command: `CALLSIGN`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.client.owners || 'the bot owner'}`,
					`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.client.logger.log(err, 'error');
			}

			// Parse the data into JSON.
			const data = JSON.parse(result);

			// Reply to the user if the database is updating.
			if (data.status === 'UPDATING') {
				return msg.reply('The Callook database is being updated with today\'s FCC record changes. Try again in a few seconds.');
			}

			// Reply to the user if no results.
			if (data.status === 'INVALID') {
				return msg.reply('That callsign is not active or invalid.');
			}

			// Name.
			sendEmbed.setAuthor(data.name);

			// Title.
			sendEmbed.setDescription(data.current.callsign.replace('0', 'Ø'));

			// FRN.
			sendEmbed.addField('FRN', data.otherInfo.frn, true);

			// Category.
			sendEmbed.addField('CATEGORY', data.type, true);

			// Status.
			sendEmbed.addField('STATUS', data.status, true);

			// Grant date.
			sendEmbed.addField('GRANT DATE', data.otherInfo.grantDate, true);

			// Last action date.
			sendEmbed.addField('LAST ACTION DATE', data.otherInfo.lastActionDate, true);

			// Expire date.
			sendEmbed.addField('EXPIRE DATE', data.otherInfo.expiryDate, true);

			// Address.
			sendEmbed.addField('ADDRESS', `${data.address.line1}, ${data.address.line2}`);

			// Grid square.
			sendEmbed.addField('GRID SQUARE', data.location.gridsquare, true);

			// Coordinates.
			sendEmbed.addField('COORDINATES', `${(Math.round((parseFloat(data.location.latitude) + Number.EPSILON) * 100) / 100).toFixed(2)}, ${(Math.round((parseFloat(data.location.longitude) + Number.EPSILON) * 100) / 100).toFixed(2)}`, true);

			// Operator class or trustee.
			if (data.current.operClass) {
				sendEmbed.addField('OPERATOR CLASS', data.current.operClass, true);
			}
			else {
				sendEmbed.addField('TRUSTEE', `${data.trustee.name} (${data.trustee.callsign})`, true);
			}

			// ULS URL.
			sendEmbed.addField('ULS URL', data.otherInfo.ulsUrl);

			// Reply to the user.
			msg.reply(sendEmbed);
		});
	}
};
