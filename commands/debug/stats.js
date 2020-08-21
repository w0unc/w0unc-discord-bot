'use strict';


// Imports the Moment.js library.
const moment = require('moment');
require('moment-duration-format');


// Imports 'version' from the Discord.js library.
const discord = require('discord.js').version;


// Imports 'Command' and 'version' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');
const commando = require('discord.js-commando').version;


// Command that displays basic bot statistics.
module.exports = class Stats extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			aliases: ['statistics'],
			group: 'debug',
			memberName: 'stats',
			description: 'Displays basic bot statistics.',
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	// The main run function of the Stats command.
	async run(msg) {
		// Reply to the user.
		msg.reply([
			'= STATISTICS =\n',
			`• Mem Usage  :: ${(Math.round(((process.memoryUsage().heapUsed / 1048576) + Number.EPSILON) * 100) / 100).toFixed(2)}MB`,
			`• Uptime     :: ${moment.duration(this.client.uptime).format('D[d] H[h] m[m] s[s]')}`,
			`• Servers    :: ${this.client.guilds.cache.size}`,
			`• Channels   :: ${this.client.channels.cache.filter(channel => channel.type !== 'dm' && channel.type !== 'category').size}`,
			`• Users      :: ${this.client.users.cache.filter(user => !user.bot).size}`,
			`• Node.js    :: ${process.version}`,
			`• Discord.js :: v${discord}`,
			`• Commando   :: v${commando}`,
		].join('\n'), { code: 'asciidoc' });
	}
};
