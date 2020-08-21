'use strict';


// Imports the Moment.js library.
const moment = require('moment');


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that finds the time difference between two time zones.
module.exports = class TimeDiff extends Command {
	constructor(client) {
		super(client, {
			name: 'timediff',
			aliases: ['timedif'],
			group: 'time',
			memberName: 'timediff',
			description: 'Finds the difference between two time zones.',
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
			examples: ['timediff est gmt'],
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'zoneFrom',
					prompt: 'Please specify a time zone to convert from.',
					error: 'That is not a valid time zone. See the help documentation for valid time zones.',
					type: 'string',
					oneOf: [
						'hst', 'hdt', 'pst', 'pdt', 'mst', 'mdt', 'cst', 'cdt', 'est', 'edt',
						'gmt', 'utc', 'bst', 'ist', 'cet', 'cest', 'eet', 'eest',
					],
				}, {
					key: 'zoneTo',
					prompt: 'Please specify a time zone to convert to.',
					error: 'That is not a valid time zone. See the help documentation for valid time zones.',
					type: 'string',
					oneOf: [
						'hst', 'hdt', 'pst', 'pdt', 'mst', 'mdt', 'cst', 'cdt', 'est', 'edt',
						'gmt', 'utc', 'bst', 'ist', 'cet', 'cest', 'eet', 'eest',
					],
				},
			],
		});
	}

	// The main run function of the TimeDiff command.
	async run(msg, { zoneFrom, zoneTo }) {
		zoneFrom = zoneFrom.toUpperCase();
		zoneTo = zoneTo.toUpperCase();

		const timeZones = {
			// US
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

			// EU
			gmt: 'Europe/London',
			bst: 'Europe/London',
			ist: 'Europe/Dublin',
			cet: 'Europe/Paris',
			cest: 'Europe/Paris',
			eet: 'Europe/Helsinki',
			eest: 'Europe/Helsinki',
		};

		// Return if the from time zone is not available.
		if (!(zoneFrom.toLowerCase() in timeZones)) {
			return msg.reply(`\`${zoneFrom}\` is not currently supported.`);
		}

		// Return if the to time zone is not available.
		if (!(zoneTo.toLowerCase() in timeZones)) {
			return msg.reply(`\`${zoneTo}\` is not currently supported.`);
		}

		const tz1 = moment.tz(timeZones[zoneFrom.toLowerCase()]).utcOffset();
		const tz2 = moment.tz(timeZones[zoneTo.toLowerCase()]).utcOffset();

		const diff = (tz1 - tz2) / 60;

		// Reply to the user.
		if (diff < 0) {
			msg.reply(`**${zoneFrom}** is ${Math.abs(diff)} hour(s) behind **${zoneTo}**`);
		}
		else if (diff > 0) {
			msg.reply(`**${zoneFrom}** is ${Math.abs(diff)} hour(s) ahead of **${zoneTo}**`);
		}
		else {
			msg.reply(`**${zoneFrom}** is the same time as **${zoneTo}**`);
		}
	}
};
