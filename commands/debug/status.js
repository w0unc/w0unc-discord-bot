'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that displays the bot status.
module.exports = class Status extends Command {
	constructor(client) {
		super(client, {
			name: 'status',
			group: 'debug',
			memberName: 'status',
			description: 'Displays the bot status.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	// The main run function of the Status command.
	async run(msg) {
		try {
			// Sends a message to the channel and waits for it to arrive.
			const ping = await msg.channel.send('Ping?');

			// Reply to the user.
			ping.edit([
				`**Online! Latency:** ${ping.createdTimestamp - msg.createdTimestamp} ms`,
				`**API Latency:** ${msg.guild.shard.ping} ms`,
			].join(' | '));
		}
		catch (e) {
			// Reply to the user if error.
			msg.reply([
				'An error occurred while running the command: `Status`',
				'You shouldn\'t ever receive an error like this.',
				`Please contact ${this.client.owners || 'the bot owner'}`,
				`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
			].join('\n'));

			// Log the error.
			this.client.logger.log(e, 'error');
		}
	}
};
