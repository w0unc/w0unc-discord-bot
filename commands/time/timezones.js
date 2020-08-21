'use strict';


// Imports the Moment.js library.
const moment = require('moment');


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that lists times in time zones.
module.exports = class Timezones extends Command {
	constructor(client) {
		super(client, {
			name: 'timezones',
			aliases: ['tz', 'tzs', 'times'],
			group: 'time',
			memberName: 'timezones',
			description: 'Lists times in time zones.',
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
			examples: [
				'timezones',
				'timezones common',
				'timezones us',
				'timezones eu',
			],
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'filter',
					label: '"common"/"us"/"eu"',
					prompt: 'Please specify a filter.',
					error: 'That is not a valid filter. Valid filters are: `common`, `us`, and `eu`.',
					type: 'string',
					default: 'common',
					oneOf: ['common', 'us', 'eu'],
				},
			],
		});
	}

	// The main run function of the Timezones command.
	async run(msg, { filter }) {
		filter = filter.toLowerCase();

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

		// Reply to the user with US time zones.
		if (filter === 'us') {
			return msg.reply([
				`• ${moment().tz(timeZones.hst).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.pst).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.mst).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.cst).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.est).format('zz :: DD MMM YYYY, hh:mm A')}`,
			].join('\n'), { code: 'asciidoc' });
		}

		// Reply to the user with EU time zones.
		if (filter === 'eu') {
			return msg.reply([
				`• ${moment().utc().format('UTC :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.gmt).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.cet).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.eet).format('zz :: DD MMM YYYY, hh:mm A')}`,
			].join('\n'), { code: 'asciidoc' });
		}

		// Reply to the user with common time zones.
		if (filter === 'common') {
			msg.reply([
				`• ${moment().tz(timeZones.pst).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.est).format('zz :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().utc().format('UTC :: DD MMM YYYY, hh:mm A')}`,
				`• ${moment().tz(timeZones.gmt).format('zz :: DD MMM YYYY, hh:mm A')}`,
			].join('\n'), { code: 'asciidoc' });
		}
	}
};
