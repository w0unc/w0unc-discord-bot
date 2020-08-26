'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that gets the ARRL Band Chart.
module.exports = class BandChart extends Command {
	constructor(client) {
		super(client, {
			name: 'bandchart',
			aliases: ['bchart'],
			group: 'radio',
			memberName: 'bandchart',
			description: 'Gets the ARRL Band Chart.',
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	// The main run function of the BandChart command.
	async run(msg) {
		// Reply to the user.
		return msg.reply({ files: ['media/bandchart.jpg'] });
	}
};
