/**
 * @file File for the 'aprs' command.
 */




const https = require('https');
const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { aprsAPIKey } = require('../../config.json');




module.exports = {


	cooldown: 1,


	data: new SlashCommandBuilder()
		.setName('aprs')
		.setDescription('Fetches information from the aprs.fi API.')
		.addStringOption((option) =>
			option.setName('name')
				.setDescription('The name to search for.')
				.setRequired(true))
		.addStringOption((option) =>
			option.setName('what')
				.setDescription('The name to search for.')
				.addChoices(
					{ name: 'loc', value: 'loc' },
					{ name: 'msg', value: 'msg' },
					{ name: 'wx', value: 'wx' },
				)),


	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('name');

		const options = {
			host: 'api.aprs.fi',
			path: `/api/get?name=${name}&what=loc&apikey=${aprsAPIKey}&format=json`,
			timeout: 5000,
		};

		await https.get(options, (res) => {
			const body = [];

			res.on('data', (chunk) => {
				body.push(chunk);
			});

			res.on('end', async() => {
				const data = JSON.parse(body);

				if (data.found === 0) return await interaction.editReply(`Found no results for ${bold(name)}.`);

				const entry = data.entries[0];
				const longest = Object.keys(entry).reduce((a, b) => a > b.length ? a : b.length, 0);
				const aprs = [];

				for (const [key, value] of Object.entries(entry)) {
					aprs.push(`• ${key}${' '.repeat(longest - key.length)} :: ${value}`);
				}

				await interaction.editReply(codeBlock('asciidoc', aprs.join('\n')));
			});
		}).on('error', async(err) => {
			console.log('Error: ', err.message);
			await interaction.editReply('Unable to complete request due to an API error.');
		}).on('timeout', async() => {
			await interaction.editReply('Timed out waiting for API response.');
		});
	},


};
