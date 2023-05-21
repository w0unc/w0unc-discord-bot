/**
 * @file File for the 'morsechart' command.
 */




const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');




module.exports = {


	cooldown: 60,


	data: new SlashCommandBuilder()
		.setName('morsechart')
		.setDescription('Shows the international morse code chart.'),


	async execute(interaction) {
		const file = new AttachmentBuilder('./media/morsechart.jpg');
		await interaction.reply({ files: [file] });
	},


};
