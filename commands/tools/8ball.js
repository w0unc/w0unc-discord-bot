'use strict';


// Imports 'Command' from the Sapphire library.
const { Command } = require('@sapphire/framework');


// Command that asks the Magic 8-Ball a question.
module.exports = class Magic8Ball extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'magic8ball',
			aliases: ['m8ball', 'magiceight', '8ball'],
			description: 'Asks the 8-Ball a question.',
			cooldownDelay: 5_000
		});
	}

	// The main run function of the Magic8Ball command.
	async messageRun(message) {
		// Magic 8-Ball responses.
		const responses = [
			'It is certain',
			'It is decidedly so',
			'Without a doubt',
			'Yes – definitely',
			'You may rely on it',
			'As I see it, yes',
			'Most likely',
			'Outlook good',
			'Yes',
			'Signs point to yes',
			'Reply hazy, try again',
			'Ask again later',
			'Better not tell you now',
			'Cannot predict now',
			'Concentrate and ask again',
			'Don\'t count on it',
			'My reply is no',
			'My sources say no',
			'Outlook not so good',
			'Very doubtful',
		];

		// Reply to the user.
		message.reply(responses[Math.floor(Math.random() * responses.length)]);
	}
}
