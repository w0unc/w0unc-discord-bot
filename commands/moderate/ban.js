'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that bans a member from the server.
module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'moderate',
			memberName: 'ban',
			description: 'Bans a member from the server.',
			guildOnly: true,
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			throttling: {
				usages: 1,
				duration: 1,
			},
			args: [
				{
					key: 'member',
					prompt: 'Please specify the member to ban from the server.',
					type: 'member',
				},
				{
					key: 'days',
					prompt: 'Please specify the number of days worth of messages to delete.',
					type: 'integer',
					max: 7,
					min: 0,
				},
				{
					key: 'reason',
					prompt: 'Please specify the reason for banning the member.',
					type: 'string',
					max: 100,
					min: 1,
				},
			],
		});
	}

	// The main run function of the Ban command.
	async run(msg, { member, days, reason }) {
		// Bans the member from the server.
		member.ban({ days: days, reason: reason })
			// Reply to the user.
			.then(ban => { msg.reply(`${ban.displayName} has been banned from the server.`); })

			// Reply to the user if error.
			.catch(() => { msg.reply('I cannot do that on a member with a role higher than or equal to my current highest role.'); });
	}
};
