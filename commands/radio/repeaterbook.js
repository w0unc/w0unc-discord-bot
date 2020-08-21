'use strict';


// Imports the Moment.js library.
const moment = require('moment');


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports 'MessageEmbed' from the Discord.js library.
const { MessageEmbed } = require('discord.js');


// Imports the APICall module.
const APICall = require('../../modules/APICall');


// Command that gets information on a repeater.
module.exports = class RepeaterBook extends Command {
	constructor(client) {
		super(client, {
			name: 'repeaterbook',
			aliases: ['rbook', 'rp', 'repeater'],
			group: 'radio',
			memberName: 'repeaterbook',
			description: 'Gets information on a repeater.',
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'criteria',
					prompt: 'Please specify a repeater call sign.',
					type: 'string',
					max: 10,
					min: 1,
				},
				{
					key: 'choice',
					prompt: 'Please specify a repeater call sign.',
					type: 'integer',
					max: 99,
					min: 1,
					default: 0,
				},
			],
		});
	}

	// The main run function of the RepeaterBook command.
	async run(msg, { criteria, choice }) {
		// API call options.
		const options = {
			host: 'repeaterbook.com',
			path: `/api/export.php?callsign=${criteria}`,
		};

		// API call.
		APICall.call(options, (err, res) => {
			if (err) {
				// Reply to the user if error.
				msg.reply([
					'An error occurred while running the command: `RepeaterBook`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.client.owners || 'the bot owner'}`,
					`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.client.logger.log(err, 'error');
			}

			// Parse the data into JSON.
			const data = JSON.parse(res);

			// Reply to the user if no results were found.
			if (data.count === 0) {
				return msg.reply('There were no results found given that criteria.');
			}

			if (choice > data.count) {
				return msg.reply(`There are not ${choice} repeaters with that call sign.`);
			}

			// Reply to the user if error.
			if (data.count > 1 && choice === 0) {
				let repeaters = 'There are more than one repeater with that call sign. Append a number to select one of the following repeaters:\n';
				let modes = [];

				for (let i = 0; i < data.count; i++) {
					repeaters += `(${i + 1}) ${data.results[i].Callsign} - ${data.results[i].Frequency} - `;

					if (data.results[i]['Analog Capable'] === 'Yes' ||
					(data.results[i].DMR === 'No' && data.results[i]['D-Star'] === 'No' &&
					data.results[i]['APCO P-25'] === 'No' && data.results[i]['System Fusion'] === 'No')) {
						modes.push('Analog');
					}

					if (data.results[i].DMR === 'Yes') {
						modes.push('DMR');
					}

					if (data.results[i]['D-Star'] === 'Yes') {
						modes.push('D-Star');
					}

					if (data.results[i]['APCO P-25'] === 'Yes') {
						modes.push('P25');
					}

					if (data.results[i]['System Fusion'] === 'Yes') {
						modes.push('YSF');
					}

					repeaters += modes.join(', ') + '\n';
					modes = [];
				}

				return msg.reply(repeaters, { code: 'asciidoc' });
			}

			// Index.
			let index;

			if (data.count === 1) {
				index = 0;
			}
			else {
				index = choice - 1;
			}

			// For sending a RichEmbed message.
			const sendEmbed = new MessageEmbed();

			// Call sign.
			sendEmbed.setAuthor(data.results[index].Callsign.replace('0', 'Ø'));

			// State.
			sendEmbed.setDescription(`${data.results[index]['Operational Status']} - ${data.results[index].Use}`);

			// Image.
			sendEmbed.setThumbnail(
				'https://www.repeaterbook.com/images/logo_200.gif',
			);

			// Frequency.
			sendEmbed.addField('FREQUENCY', data.results[index].Frequency, true);

			// Input frequency.
			sendEmbed.addField('INPUT FREQUENCY', `${data.results[index]['Input Freq']} (${(data.results[index]['Input Freq'] - data.results[index].Frequency).toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} MHz)`, true);

			// Tones.
			let tones = 'None';

			if (data.results[index].PL) {
				tones = `${data.results[index].PL} In`;
				if (data.results[index].TSQ) {
					tones += ` / ${data.results[index].TSQ} Out`;
				}
			}
			else if (data.results[index].TSQ) {
				tones += `${data.results[index].TSQ} Out`;
			}

			sendEmbed.addField('TONES', tones, true);

			// Landmark or nearest city.
			if (data.results[index].Landmark) {
				sendEmbed.addField('LANDMARK', data.results[index].Landmark, true);
			}
			else {
				sendEmbed.addField('NEAREST CITY', data.results[index]['Nearest City'], true);
			}

			// State.
			sendEmbed.addField('STATE', data.results[index].State, true);

			// Country
			sendEmbed.addField('COUNTRY', data.results[index].Country, true);

			// Modes.
			const modes = [];

			if (data.results[index]['Analog Capable'] === 'Yes' ||
			(data.results[index].DMR === 'No' && data.results[index]['D-Star'] === 'No' &&
			data.results[index]['APCO P-25'] === 'No' && data.results[index]['System Fusion'] === 'No')) {
				modes.push('Analog');
			}

			if (data.results[index].DMR === 'Yes') {
				modes.push('DMR');
			}

			if (data.results[index]['D-Star'] === 'Yes') {
				modes.push('D-Star');
			}

			if (data.results[index]['APCO P-25'] === 'Yes') {
				modes.push('P25');
			}

			if (data.results[index]['System Fusion'] === 'Yes') {
				modes.push('YSF');
			}

			sendEmbed.addField('MODES', modes.join(', '), true);

			// Nodes.
			const nodes = [];

			if (data.results[index]['AllStar Node'] === 'Yes') {
				nodes.push('AllStar');
			}

			if (data.results[index]['EchoLink Node'] !== '') {
				nodes.push(`EchoLink (${data.results[index]['EchoLink Node']})`);
			}

			if (data.results[index]['IRLP Node'] === 'Yes') {
				nodes.push('IRLP');
			}

			if (data.results[index]['Wires Node'] === 'Yes') {
				nodes.push('Wires');
			}

			if (nodes.length !== 0) {
				sendEmbed.addField('NODES', nodes.join(', '), true);
			}

			// Services.
			const services = [];

			if (data.results[index]['ARES'] === 'Yes') {
				services.push('ARES');
			}

			if (data.results[index]['RACES'] === 'Yes') {
				services.push('RACES');
			}

			if (data.results[index]['SKYWARN'] === 'Yes') {
				services.push('SKYWARN');
			}

			if (data.results[index]['CANWARN'] === 'Yes') {
				services.push('CANWARN');
			}

			if (services.length !== 0) {
				sendEmbed.addField('SERVICES', services.join(', '), true);
			}

			// Last update.
			sendEmbed.addField('LAST UPDATE', moment(data.results[index]['Last Update']).format('DD MMM YYYY'));

			// Trustee.
			if (data.results[index].Trustee) {
				sendEmbed.addField('TRUSTEE', data.results[index].Trustee);
			}

			// Link.
			sendEmbed.addField('REPEATERBOOK', `https://repeaterbook.com/repeaters/details.php?state_id=${data.results[index]['State ID']}&ID=${data.results[index]['Rptr ID']}`);

			// Reply to the user.
			return msg.reply(sendEmbed);
		});
	}
};
