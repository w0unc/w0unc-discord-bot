'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that lists the channels the bot is currently in.
module.exports = class Channels extends Command {
	constructor(client) {
		super(client, {
			name: 'channels',
			group: 'moderate',
			memberName: 'channels',
			description: 'Lists the channels the bot is currently in.',
			ownerOnly: true,
		});
	}

	// The main run function of the Channels command.
	async run(msg) {
		// Reply to the user if error.
		if (this.client.channels.size === 0) {
			msg.reply('I am not currently in any channel.');
		}

		// Format the data.
		const channels = this.client.channels.cache.array();
		let list = '';
		for (let i = 0; i < channels.length; i++) {
			list += `${channels[i].id}   ${channels[i].name}\n`;
		}

		// Reply to the user.
		msg.reply([
			'= CHANNELS =\n',
			'ID                   Name',
			list,
		].join('\n'), { code: 'asciidoc' });
	}
};
