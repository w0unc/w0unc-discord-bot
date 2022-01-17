'use strict';


// Imports 'Command' and 'CommandOptionsRunTypeEnum' from the Sapphire library.
const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');


// Command that bans a member from the server.
module.exports = class Ban extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'ban',
			description: 'Bans a member from the server.',
			runIn: CommandOptionsRunTypeEnum.GuildAny,
			requiredClientPermissions: ['BAN_MEMBERS'],
			requiredUserPermissions: ['BAN_MEMBERS'],
			options: ['days', 'reason'],
			cooldownDelay: 5_000
		});
	}

	// The main run function of the Ban command.
	async messageRun(message, args) {
		// Arguments.
		const member = await args.pick('member').catch(() => null);
		const days = await args.getOption('days');
		const reason = await args.getOption('reason');

		// Member to ban validation.
		if (!member) {
			return message.reply('You must provide a member to ban.');
		}

		// Number of days to ban validation.
		if (days > 7) {
			return message.reply('The number of days to ban must be less than or equal to 7.');
		}

		// Ban reason validation.
		if (reason > 2000) {
			return message.reply('Ban reason must be 2000 or less characters.');
		}
		console.log(days);
		console.log(reason);
		// Bans the member from the server.
		member.ban({ days: days, reason: reason })
			// Reply to the user.
			.then(ban => { message.reply(`${ban.displayName} has been banned from the server.`); })

			// Reply to the user if error.
			.catch(() => { message.reply('Unable to ban the user from the server.'); });
	}
};
