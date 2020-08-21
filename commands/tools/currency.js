'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports the APICall module.
const APICall = require('../../modules/APICall');


// Command that converts currencies.
module.exports = class Currency extends Command {
	constructor(client) {
		super(client, {
			name: 'currency',
			group: 'tools',
			memberName: 'currency',
			description: 'Converts currencies.',
			examples: [
				'currency 1000 USD EUR',
				'currency 1000.00 USD EUR',
			],
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'amount',
					prompt: 'Please specify an amount of currency to convert.',
					type: 'float',
					max: 100000000000000,
					min: 0,
				}, {
					key: 'currencyFrom',
					prompt: 'Please specify a currency to convert from.',
					type: 'string',
					max: 3,
					min: 3,
				}, {
					key: 'currencyTo',
					prompt: 'Please specify a currency to convert to.',
					type: 'string',
					max: 3,
					min: 3,
				},
			],
		});
	}

	// The main run function of the Currency command.
	async run(msg, { amount, currencyFrom, currencyTo }) {
		currencyFrom = currencyFrom.toUpperCase();
		currencyTo = currencyTo.toUpperCase();

		// API call options.
		const options = {
			host: 'api.exchangeratesapi.io',
			path: `/latest?base=${currencyFrom}&symbols=${currencyTo}`,
		};

		// API call.
		APICall.call(options, (err, result, statusCode) => {
			if (err || statusCode === 404) {
				// Reply to the user if error.
				console.log(this.client.config);
				msg.reply([
					'An error occurred while running the command: `Currency`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.client.owners || 'the bot owner'}`,
					`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.client.logger.log(err, 'error');
			}

			// Parse the data into JSON.
			const data = JSON.parse(result);

			// Reply to the user if error.
			if (data.error) {
				return msg.reply(data.error);
			}

			// Calculate currency conversion.
			const amountFrom = (Math.round(((amount) + Number.EPSILON) * 100) / 100).toFixed(2);
			const amountTo = (Math.round(((data.rates[currencyTo] * amount) + Number.EPSILON) * 100) / 100).toFixed(2);

			// Reply to the user.
			msg.reply(`${amountFrom} ${currencyFrom} = ${amountTo} ${currencyTo}`);
		});
	}
};
