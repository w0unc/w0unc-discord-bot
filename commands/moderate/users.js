'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that lists the users the bot is serving.
module.exports = class Users extends Command {
	constructor(client) {
		super(client, {
			name: 'users',
			group: 'moderate',
			memberName: 'users',
			description: 'Lists the users the bot is serving.',
			ownerOnly: true,
		});
	}

	// The main run function of the Users command.
	async run(msg) {
		// Reply to the user if error.
		if (this.client.users.size === 0) {
			msg.reply('I am not currently serving any users.');
		}

		// Format the data.
		const users = this.client.users.cache.array();
		let list = '';
		for (let i = 0; i < users.length; i++) {
			list += `${users[i].id}   ${users[i].tag}\n`;
		}

		// Reply to the user.
		msg.reply([
			'= USERS =\n',
			'ID                   Name',
			list,
		].join('\n'), { code: 'asciidoc' });
	}
};
