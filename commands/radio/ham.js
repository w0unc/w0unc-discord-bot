/**
 * @file File for the 'ham' command
 */




const https = require('https');
const { EmbedBuilder, SlashCommandBuilder, bold } = require('discord.js');




module.exports = {


	cooldown: 5,


	data: new SlashCommandBuilder()
		.setName('ham')
		.setDescription('Replies with ham radio callsign information.')
		.addStringOption((option) =>
			option.setName('callsign')
				.setDescription('The callsign to search for.')
				.setRequired(true)),


	async execute(interaction) {
		await interaction.deferReply();
		const callsign = interaction.options.getString('callsign').replaceAll('Ø', '0');

		if (!callsign.match(/^[0-9a-zA-ZØ]+$/)) return await interaction.editReply('Valid callsigns can only contain letters, numbers, and the fancy Ø.');

		const options = {
			host: 'callook.info',
			path: `/${callsign}/json`,
			timeout: 5000,
		};

		await https.get(options, (res) => {
			const body = [];

			res.on('data', (chunk) => {
				body.push(chunk);
			});

			res.on('end', async() => {
				const data = JSON.parse(body);

				if (data.status === 'INVALID') return await interaction.editReply(`${bold(callsign)} is not a valid ham radio callsign or was not found in the database.`);

				const embed = new EmbedBuilder();

				embed
					.setAuthor({ name: data.name })
					.setDescription(data.current.callsign.replaceAll('0', 'Ø'))
					.addFields(
						{ name: 'FRN', value: data.otherInfo.frn, inline: true },
						{ name: 'TYPE', value: data.type, inline: true },
						{ name: 'STATUS', value: data.status, inline: true },
						{ name: 'GRANT DATE', value: data.otherInfo.grantDate, inline: true },
						{ name: 'LAST ACTION DATE', value: data.otherInfo.lastActionDate, inline: true },
						{ name: 'EXPIRY DATE', value: data.otherInfo.expiryDate, inline: true },
						{ name: 'ADDRESS', value: data.address.line1 + ', ' + data.address.line2 },
						{ name: 'GRID SQUARE', value: data.location.gridsquare, inline: true },
						{ name: 'COORDINATES', value: `${(Math.round((parseFloat(data.location.latitude) + Number.EPSILON) * 100) / 100).toFixed(2)}, ${(Math.round((parseFloat(data.location.longitude) + Number.EPSILON) * 100) / 100).toFixed(2)}`, inline: true },
					);

				if (data.current.operClass) {
					embed.addFields({ name: 'OPERATOR CLASS', value: data.current.operClass, inline: true });
				} else {
					embed.addFields({ name: 'TRUSTEE', value: `${data.trustee.name} (${data.trustee.callsign})`, inline: true });
				}

				embed.addFields({ name: 'ULS URL', value: data.otherInfo.ulsUrl });
				await interaction.editReply({ embeds: [embed] });
			});
		}).on('error', async(err) => {
			console.log('Error: ', err.message);
			await interaction.editReply('Unable to complete request due to an API error.');
		}).on('timeout', async() => {
			await interaction.editReply('Timed out waiting for API response.');
		});
	},


};
