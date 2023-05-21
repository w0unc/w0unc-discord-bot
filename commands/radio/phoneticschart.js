/**
 * @file File for the 'phoneticschart' command.
 */




const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');




module.exports = {


	cooldown: 60,


	data: new SlashCommandBuilder()
		.setName('phoneticschart')
		.setDescription('Shows the NATO phonetics chart.'),


	async execute(interaction) {
		const file = new AttachmentBuilder('./media/phoneticschart.jpg');
		await interaction.reply({ files: [file] });
	},


};
