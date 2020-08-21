'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that allows the bot owner to speak as the bot.
module.exports = class Say extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['speak', 's'],
			group: 'moderate',
			memberName: 'say',
			description: 'Allows the bot owner to speak as the bot.',
			ownerOnly: true,
			args: [
				{
					key: 'channel',
					prompt: 'Please specify a Discord channel ID or tag.',
					type: 'string',
				},
				{
					key: 'text',
					prompt: 'Please specify the text to send to the Discord channel.',
					type: 'string',
					max: 2000,
					min: 1,
				},
			],
		});
	}

	// The main run function of the Say command.
	async run(msg, { channel, text }) {
		if (this.client.channels.cache.get(channel) && this.client.channels.cache.get(channel).type === 'text') {
			// Sends the message.
			this.client.channels.cache.get(channel).send(text)
				// Reply to the user.
				.then(() => { msg.reply('Sent'); })

				// Reply to the user if error.
				.catch(() => { msg.reply('I do not have permission to send messages to that channel.'); });
		}
		else {
			// Reply to the user if error.
			msg.reply('That is not a text channel.');
		}
	}
};
