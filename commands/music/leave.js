'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that removes the bot from the users voice channel.
module.exports = class Leave extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			group: 'music',
			memberName: 'leave',
			description: 'Removes the bot from the users voice channel.',
			throttling: {
				usages: 1,
				duration: 1,
			},
		});
	}

	// The main run function of the Leave command.
	async run(msg) {
		// Reply to the user if error.
		if (!msg.member.voice.channel) {
			return msg.reply('You are not currently in a voice channel.');
		}

		// Leave the voice channel.
		const channel = msg.member.voice.channel;
		channel.leave();
	}
};
