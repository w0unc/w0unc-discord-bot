/**
 * @file File for the 'dtmf' command.
 */




const { SlashCommandBuilder } = require('discord.js');




module.exports = {


	cooldown: 1,


	data: new SlashCommandBuilder()
		.setName('dtmf')
		.setDescription('Converts DTMF to a number.')
		.addStringOption((option) =>
			option.setName('dtmf')
				.setDescription('DTMF string to use.')
				.setRequired(true)
				.setMaxLength(64)),


	async execute(interaction) {
		const dtmf = interaction.options.getString('dtmf')
			.replace(/a|b|c/ig, 2)
			.replace(/d|e|f/ig, 3)
			.replace(/g|h|i/ig, 4)
			.replace(/j|k|l/ig, 5)
			.replace(/m|n|o/ig, 6)
			.replace(/p|q|r|s/ig, 7)
			.replace(/t|u|v/ig, 8)
			.replace(/w|x|y|z/ig, 9);

		await interaction.reply(dtmf);
	},


};
