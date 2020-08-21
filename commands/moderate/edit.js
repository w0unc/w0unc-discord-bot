'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that edits a message from this bot.
module.exports = class Edit extends Command {
	constructor(client) {
		super(client, {
			name: 'edit',
			group: 'moderate',
			memberName: 'edit',
			description: 'Edits a message from this bot.',
			guildOnly: true,
			clientPermissions: ['MANAGE_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'id',
					prompt: 'Please specify an ID for a message to edit.',
					type: 'string',
				},
				{
					key: 'text',
					prompt: 'Please specify the text you want to replace the message with.',
					type: 'string',
					max: 1950,
					min: 1,
				},
			],
		});
	}

	// The main run function of the Edit command.
	async run(msg, { id, text }) {
		msg.channel.messages.fetch(id).then(message => {
			message.edit(text);
			msg.delete();
		});
	}
};
