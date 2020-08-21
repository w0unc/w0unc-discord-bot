'use strict';


// Imports the Moment.js Time Zone library.
const moment = require('moment-timezone');


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that display the time in a time zone.
module.exports = class Time extends Command {
	constructor(client) {
		super(client, {
			name: 'time',
			aliases: ['t'],
			group: 'time',
			memberName: 'time',
			description: 'Display the time in a time zone.',
			details: [
				'\nSupported Time Zones',
				'```asciidoc',
				'== [ US ] ==\n',
				'HST :: Pacific/Honolulu',
				'HDT :: Pacific/Honolulu',
				'PST :: America/Los_Angeles',
				'PDT :: America/Los_Angeles',
				'MST :: America/Denver',
				'MDT :: America/Denver',
				'CST :: America/Chicago',
				'CDT :: America/Chicago',
				'EST :: America/New_York',
				'EDT :: America/New_York',
				'\n== [ EU ] ==\n',
				'GMT  :: UTC',
				'UTC  :: GMT',
				'BST  :: Europe/London',
				'IST  :: Europe/Dublin',
				'CET  :: Europe/Paris',
				'CEST :: Europe/Paris',
				'EET  :: Europe/Helsinki',
				'EEST :: Europe/Helsinki',
				'```',
			].join('\n'),
			examples: ['time est'],
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'timezone',
					prompt: 'Please specify a time zone.',
					error: 'That is not a valid time zone. See the help documentation for valid time zones.',
					type: 'string',
					default: 'utc',
					oneOf: [
						'hst', 'hdt', 'pst', 'pdt', 'mst', 'mdt', 'cst', 'cdt', 'est', 'edt',
						'gmt', 'utc', 'bst', 'ist', 'cet', 'cest', 'eet', 'eest',
					],
				},
			],
		});
	}

	// The main run function of the Time command.
	async run(msg, { timezone }) {
		timezone = timezone.toLowerCase();

		const timeZones = {
			// US.
			hst: 'Pacific/Honolulu',
			hdt: 'Pacific/Honolulu',
			pst: 'America/Los_Angeles',
			pdt: 'America/Los_Angeles',
			mst: 'America/Denver',
			mdt: 'America/Denver',
			cst: 'America/Chicago',
			cdt: 'America/Chicago',
			est: 'America/New_York',
			edt: 'America/New_York',

			// EU.
			bst: 'Europe/London',
			ist: 'Europe/Dublin',
			cet: 'Europe/Paris',
			cest: 'Europe/Paris',
			eet: 'Europe/Helsinki',
			eest: 'Europe/Helsinki',
		};

		// Reply to the user.
		if (timezone === 'gmt' || timezone === 'utc') {
			msg.reply(`${moment().utc()
				.format('**UTC:** DD MMM YYYY, hh:mm A')}`);
		}
		else {
			msg.reply(`${moment().tz(timeZones[timezone])
				.format('**zz:** DD MMM YYYY, hh:mm A')}`);
		}
	}
};
