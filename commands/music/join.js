'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that brings the bot into the users voice channel.
module.exports = class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			group: 'music',
			memberName: 'join',
			description: 'Brings the bot into the users voice channel.',
			clientPermissions: ['CONNECT', 'SPEAK'],
			throttling: {
				usages: 1,
				duration: 1,
			},
		});
	}

	// The main run function of the Join command.
	async run(msg) {
		// Reply to the user if error.
		if (!msg.member.voice.channel) {
			return msg.reply('You are not currently in a voice channel.');
		}

		// Join the voice channel.
		const channel = msg.member.voice.channel;
		channel.join();
	}
};
