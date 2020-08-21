'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that generates one or more random integers.
module.exports = class Random extends Command {
	constructor(client) {
		super(client, {
			name: 'random',
			aliases: ['rand', 'randint'],
			group: 'tools',
			memberName: 'random',
			description: 'Generates one or more random integers.',
			details: [
				'\nUse the `~` (tilde) character as a placeholder for defaults.',
				'Default Minimum: 1',
				'Default Maximum: 10',
				'Default Count: 1',
			].join('\n'),
			examples: [
				'random',
				'random 50',
				'random 50 100',
				'random 50 100 ~',
				'random 50 100 5',
				'random 50 ~ 5',
				'random 5 ~',
				'random 5 ~ ~',
				'random ~ 5',
				'random ~ 5 ~',
				'random ~ ~ 5',
				'random ~ ~ ~',
			],
			throttling: {
				usages: 1,
				duration: 3,
			},
			args: [
				{
					key: 'min',
					prompt: 'What is the lowest integer to roll for?',
					type: 'integer|string',
					validate: min => {
						if (min >= 0 && min <= 100) { return true; }
						if (min === '~') { return true; }
						return 'Minimum must be between 0 and 100, or the placeholder `~` (tilde) character.';
					},
				}, {
					key: 'max',
					prompt: 'What is the highest integer to roll for?',
					type: 'integer|string',
					validate: max => {
						if (max >= 0 && max <= 100) { return true; }
						if (max === '~') { return true; }
						return 'Maximum must be between 0 and 100, or the placeholder `~` (tilde) character.';
					},
				}, {
					key: 'count',
					prompt: 'How many integers do you want to generate?',
					type: 'integer|string',
					validate: count => {
						if (count > 0 && count <= 20) { return true; }
						if (count === '~') { return true; }
						return 'Count must be between 1 and 20, or the placeholder `~` (tilde) character.';
					},
				},
			],
		});
	}

	// The main run function of the Random command.
	async run(msg, { min, max, count }) {
		// If no minimum is provided, set it equal to 1.
		if (min === '~') { min = 1; }

		// If no maximum is provided, set it equal to 10.
		if (max === '~') { max = 10; }

		// If no count is provided, set it equal to 1.
		if (count === '~') { count = 1; }

		// Return if the minimum is greater than the maximum.
		if (min >= max) {
			return msg.reply('Minimum must be less than maximum.');
		}

		// Generate the numbers.
		const numbers = [];
		for (let i = 0; i < count; i++) {
			numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
		}

		// Reply to the user.
		msg.reply(numbers.join(', '));
	}
};
