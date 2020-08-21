'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports the WGET Improved library.
const wget = require('wget-improved');


// Command that retrieves solar data.
module.exports = class Solar extends Command {
	constructor(client) {
		super(client, {
			name: 'solar',
			group: 'radio',
			memberName: 'solar',
			description: 'Retrieves solar data.',
			details: 'Details on different banners can be found here: https://www.hamqsl.com/solar.html',
			examples: [
				'solar solarpic',
				'solar solarvhf',
				'solar solarphp',
				'solar solarsmall',
				'solar solarbrief',
				'solar solarbc',
				'solar solar100sc',
				'solar solar2php',
				'solar solarpich',
				'solar solar101pic',
				'solar solar101vhf',
				'solar solar101vhfper',
				'solar solar101vhfpic',
				'solar solar101sc',
				'solar solarsun',
				'solar solargraph',
				'solar marston',
				'solar solarmuf',
				'solar solarmap',
				'solar solarglobe',
				'solar moonglobe',
				'solar solarsystem',
			],
			clientPermissions: ['ATTACH_FILES'],
			userPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 30,
			},
			args: [
				{
					key: 'solar',
					prompt: 'Please specify a banner type.',
					type: 'string',
					max: 32,
					min: 0,
					default: 'solar101vhf',
				},
			],
		});
	}

	// The main run function of the Solar command.
	async run(msg, { solar }) {
		const src = `http://www.hamqsl.com/${solar}.php`;
		const result = 'media/solar.gif';
		const download = wget.download(src, result);

		download.on('error', (err) => {
			// Reply to the user if error.
			msg.reply([
				'An error occurred while running the command: `Solar`',
				'You shouldn\'t ever receive an error like this.',
				`Please contact ${this.client.owners || 'the bot owner'}`,
				`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
			].join('\n'));

			// Log the error.
			return this.client.logger.log(err, 'error');
		});

		download.on('end', () => {
			// Reply to the user.
			return msg.reply({ files: ['media/solar.gif'] });
		});
	}
};
