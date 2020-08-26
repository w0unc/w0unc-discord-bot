'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that gets the Morse Chart.
module.exports = class MorseChart extends Command {
	constructor(client) {
		super(client, {
			name: 'morsechart',
			aliases: ['mchart'],
			group: 'radio',
			memberName: 'morsechart',
			description: 'Gets the Morse Chart.',
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	// The main run function of the MorseChart command.
	async run(msg) {
		// Reply to the user.
		return msg.reply({ files: ['media/morsechart.jpg'] });
	}
};
