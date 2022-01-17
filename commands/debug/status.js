'use strict';


// Imports 'Command' from the Sapphire library.
const { Command } = require('@sapphire/framework');


// Command that displays the bot status.
module.exports = class Status extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'status',
			aliases: ['ping'],
			description: 'Displays the bot status.',
			cooldownDelay: 5_000
		});
	}

	// The main run function of the Status command.
	async messageRun(message) {
		try {
			// Sends a message to the channel and waits for it to arrive.
			const ping = await message.channel.send('Ping?');

			// Reply to the user.
			ping.edit([
				`**Online! Latency:** ${this.container.client.ws.ping} ms`,
				`**API Latency:** ${ping.createdTimestamp - message.createdTimestamp} ms`,
			].join(' | '));
		}
		catch (e) {
			// Reply to the user if error.
			message.reply([
				'An error occurred while running the command: `Status`',
				'You shouldn\'t ever receive an error like this.',
				`Please contact ${this.client.owners || 'the bot owner'}`,
				`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
			].join('\n'));

			// Log the error.
			this.client.logger.log(e, 'error');
		}
	}
}
