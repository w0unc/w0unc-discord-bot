'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that mass clears messages from a channel.
module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			group: 'moderate',
			memberName: 'clear',
			description: 'Mass clears messages from a channel.',
			guildOnly: true,
			clientPermissions: ['MANAGE_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'amount',
					prompt: 'Please specify an amount of messages to clear.',
					type: 'integer',
					min: 1,
					max: 100,
				}, {
					key: 'user',
					prompt: 'Please specify the user that you want to clear messages from.',
					type: 'user',
					default: '',
				},
			],
		});
	}

	// The main run function of the Clear command.
	async run(msg, { amount, user }) {
		msg.channel.messages.fetch({ limit: amount }).then(msgs => {
			// Filter messages.
			if (user) {
				const filterBy = user ? user.id : this.client.user.id;
				msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, amount);
			}

			// Delete messages.
			msg.channel.bulkDelete(msgs)
				// Reply to the user if error.
				.catch(() => { msg.reply('You can only bulk delete messages that are under 14 days old.'); });
		});
	}
};
