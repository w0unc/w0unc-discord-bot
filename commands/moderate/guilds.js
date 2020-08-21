'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that lists the guilds the bot is currently in.
module.exports = class Guilds extends Command {
	constructor(client) {
		super(client, {
			name: 'guilds',
			group: 'moderate',
			memberName: 'guilds',
			description: 'Lists the guilds the bot is currently in.',
			ownerOnly: true,
		});
	}

	// The main run function of the Guilds command.
	async run(msg) {
		// Reply to the user if error.
		if (this.client.guilds.size === 0) {
			msg.reply('I am not currently in any guild.');
		}

		// Format the data.
		const guilds = this.client.guilds.cache.array();
		let list = '';
		for (let i = 0; i < guilds.length; i++) {
			list += `${guilds[i].id}   ${guilds[i]}\n`;
		}

		// Reply to the user.
		msg.reply([
			'= GUILDS =\n',
			'ID                   Name',
			list,
		].join('\n'), { code: 'asciidoc' });
	}
};
