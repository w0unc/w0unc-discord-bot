'use strict';


// Imports 'Command' and 'CommandOptionsRunTypeEnum' from the Sapphire library.
const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');


// Command that mass clears messages from a channel.
module.exports = class Clear extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'clear',
			description: 'Mass clears messages from a channel.',
			runIn: CommandOptionsRunTypeEnum.GuildAny,
			requiredClientPermissions: ['MANAGE_MESSAGES'],
			requiredUserPermissions: ['MANAGE_MESSAGES'],
			options: ['amount'],
			cooldownDelay: 5_000
		});
	}

	// The main run function of the Clear command.
	async messageRun(message, args) {
		// Arguments.
		const amount = await args.getOption('amount');
		const user = await args.pick('user').catch(() => null);
		let delAmount

		// Amount of messages to delete validation.
		if (amount === null) {
			delAmount = 2;
		} else if (parseInt(amount) < 1 && parseInt(amount > 100)) {
			return message.reply('Amount of messages to delete must be between 1 and 100.');
		} else {
			delAmount = parseInt(amount) + 1;
		}

		message.channel.messages.fetch({ limit: delAmount }).then(msgs => {
			// Filter messages.
			if (user) {
				const filterBy = user ? user.id : this.client.user.id;
				msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, delAmount );
			}

			// Delete messages.
			message.channel.bulkDelete(msgs)
				// Reply to the user if error.
				.catch(() => { msg.reply('You can only bulk delete messages that are under 14 days old.'); });
		});
	}
};
