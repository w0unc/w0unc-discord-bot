'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that gets the Phonetics Chart.
module.exports = class PhoneticsChart extends Command {
	constructor(client) {
		super(client, {
			name: 'phoneticschart',
			aliases: ['phonetics', 'pchart', 'nato', 'natophonetics'],
			group: 'radio',
			memberName: 'phoneticschart',
			description: 'Gets the Phonetics Chart.',
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	// The main run function of the PhoneticsChart command.
	async run(msg) {
		// Reply to the user.
		return msg.reply({ files: ['media/phoneticschart.jpg'] });
	}
};
