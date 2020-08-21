'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that converts DTMF to a number.
module.exports = class DTMF extends Command {
	constructor(client) {
		super(client, {
			name: 'dtmf',
			group: 'radio',
			memberName: 'dtmf',
			description: 'Converts DTMF to a number.',
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'dtmf',
					prompt: 'Please specify a DTMF string.',
					type: 'string',
					max: 50,
					min: 0,
				},
			],
		});
	}

	// The main run function of the DTMF command.
	async run(msg, { dtmf }) {
		dtmf = dtmf.replace(/a|b|c/ig, 2);
		dtmf = dtmf.replace(/d|e|f/ig, 3);
		dtmf = dtmf.replace(/g|h|i/ig, 4);
		dtmf = dtmf.replace(/j|k|l/ig, 5);
		dtmf = dtmf.replace(/m|n|o/ig, 6);
		dtmf = dtmf.replace(/p|q|r|s/ig, 7);
		dtmf = dtmf.replace(/t|u|v/ig, 8);
		dtmf = dtmf.replace(/w|x|y|z/ig, 9);

		// Reply to the user.
		msg.reply(dtmf);
	}
};
