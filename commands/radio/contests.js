'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports the RSS Parser library.
const Parser = require('rss-parser');


// Command that gets the current week radio contests.
module.exports = class Contests extends Command {
	constructor(client) {
		super(client, {
			name: 'contests',
			group: 'radio',
			memberName: 'contests',
			description: 'Gets the current week radio contests.',
			throttling: {
				usages: 1,
				duration: 30,
			},
		});
	}

	// The main run function of the Contests command.
	async run(msg) {
		// Gets the contests from the WA7BNM Contest Calendar website.
		const parser = new Parser();
		let contests = await parser.parseURL('https://contestcalendar.com/calendar.rss');
		let feed = '\n';
		contests = contests.items;

		// Sorts the contests into a list.
		for (let i = 0; i < contests.length; i++) {
			feed += `${contests[i].title} ::\n${contests[i].content}\n`;
		}

		// Reply to the user.
		msg.reply(feed, { code: 'asciidoc' });
	}
};
