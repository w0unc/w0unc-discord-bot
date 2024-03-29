/**
 * @file File for the 'bandchart' command.
 */




const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');




module.exports = {


	cooldown: 60,


	data: new SlashCommandBuilder()
		.setName('bandchart')
		.setDescription('Shows the current amateur radio band chart.'),


	async execute(interaction) {
		const file = new AttachmentBuilder('./media/bandchart.jpg');
		await interaction.reply({ files: [file] });
	},


};
