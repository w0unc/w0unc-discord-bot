'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that kicks a member from the server.
module.exports = class Kick extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'moderate',
			memberName: 'kick',
			description: 'Kicks a member from the server.',
			guildOnly: true,
			clientPermissions: ['KICK_MEMBERS'],
			userPermissions: ['KICK_MEMBERS'],
			throttling: {
				usages: 1,
				duration: 1,
			},
			args: [
				{
					key: 'member',
					prompt: 'Please specify the member to kick from the server.',
					type: 'member',
				},
			],
		});
	}

	// The main run function of the Kick command.
	async run(msg, { member }) {
		// Kicks the member from the server.
		member.kick()
			// Reply to the user.
			.then(kick => { msg.reply(`${kick.displayName} has been kicked from the server.`); })

			// Reply to the user if error.
			.catch(() => { msg.reply('I cannot do that on a member with a role higher than or equal to my current highest role.'); });
	}
};
