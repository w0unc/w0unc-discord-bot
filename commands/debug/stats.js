'use strict';


// Imports the Moment.js library.
const moment = require('moment');
require('moment-duration-format');


// Imports 'version' from the Discord.js library.
const discord = require('discord.js').version;


// Imports 'Command' and 'version' from the Sapphire library.
const { Command } = require('@sapphire/framework');
const sapphire = require('@sapphire/framework').version;


// Command that displays basic bot statistics.
module.exports = class Stats extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'stats',
			aliases: ['statistics'],
			description: 'Displays basic bot statistics.',
			cooldownDelay: 5_000
		});
	}

	// The main run function of the Stats command.
	async messageRun(message) {
		// Reply to the user.
		message.reply([
			'\`\`\`asciidoc',
			'= STATISTICS =\n',
			`• Mem Usage  :: ${(Math.round(((process.memoryUsage().heapUsed / 1048576) + Number.EPSILON) * 100) / 100).toFixed(2)}MB`,
			`• Uptime     :: ${moment.duration(this.container.client.uptime).format('D[d] H[h] m[m] s[s]')}`,
			`• Servers    :: ${this.container.client.guilds.cache.size}`,
			`• Channels   :: ${this.container.client.channels.cache.filter(channel => channel.type !== 'DM' && channel.type !== 'GUILD_CATEGORY').size}`,
			`• Users      :: ${this.container.client.users.cache.filter(user => !user.bot).size}`,
			`• Node.js    :: ${process.version}`,
			`• Discord.js :: v${discord}`,
			`• Sapphire   :: v${sapphire}`,
			'\`\`\`',
		].join('\n'));
	}
}
