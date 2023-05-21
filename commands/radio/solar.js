/**
 * @file File for the 'solar' command.
 */




const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');




module.exports = {


	cooldown: 60,


	data: new SlashCommandBuilder()
		.setName('solar')
		.setDescription('Fetches solar propagation information.')
		.addStringOption((option) =>
			option.setName('type')
				.setDescription('The type of chart to retrieve.')
				.addChoices(
					{ name: 'solarpic', value: 'solarpic' },
					{ name: 'solarvhf', value: 'solarvhf' },
					{ name: 'solarphp', value: 'solarphp' },
					{ name: 'solarsmall', value: 'solarsmall' },
					{ name: 'solarbrief', value: 'solarbrief' },
					{ name: 'solarbc', value: 'solarbc' },
					{ name: 'solar100sc', value: 'solar100sc' },
					{ name: 'solar101pic', value: 'solar101pic' },
					{ name: 'solar101vhf', value: 'solar101vhf' },
					{ name: 'solar101vhfper', value: 'solar101vhfper' },
					{ name: 'solar101vhfpic', value: 'solar101vhfpic' },
					{ name: 'solar101sc', value: 'solar101sc' },
					{ name: 'solarsun', value: 'solarsun' },
					{ name: 'solargraph', value: 'solargraph' },
					{ name: 'marston', value: 'marston' },
					{ name: 'solarmuf', value: 'solarmuf' },
					{ name: 'solarmap', value: 'solarmap' },
					{ name: 'solarglobe', value: 'solarglobe' },
					{ name: 'moonglobe', value: 'moonglobe' },
					{ name: 'solarphp', value: 'solarphp' },
					{ name: 'solarsystem', value: 'solarsystem' },
				)),


	async execute(interaction) {
		await interaction.deferReply();
		const type = interaction.options.getString('type') ?? 'solar101vhf';
		const file = new AttachmentBuilder(`http://www.hamqsl.com/${type}.php`, { name: 'solar.gif' });
		await interaction.editReply({ files: [file] });
	},


};
