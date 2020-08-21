'use strict';


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Command that lists the number of members in specific roles.
module.exports = class Roster extends Command {
	constructor(client) {
		super(client, {
			name: 'roster',
			group: 'moderate',
			memberName: 'roster',
			description: 'Lists the number of members in specific roles.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	// The main run function of the Roster command.
	async run(msg) {
		const guild = this.client.guilds.cache.get('394207791277146112');

		const unlicensed = guild.roles.cache.get('405113173277147136').members.size;
		const novices = guild.roles.cache.get('742237066833690624').members.size;
		const techs = guild.roles.cache.get('618474748216737822').members.size;
		const generals = guild.roles.cache.get('618474669959544842').members.size;
		const advanced = guild.roles.cache.get('624632013843857428').members.size;
		const extra = guild.roles.cache.get('618474269692657664').members.size;
		const licensed = guild.roles.cache.get('405111994509819904').members.size;
		const advisors = guild.roles.cache.get('394208512772669453').members.size;
		const officers = guild.roles.cache.get('626966850705555488').members.size;
		const moderators = guild.roles.cache.get('418583711194546178').members.size;
		const students = guild.roles.cache.get('441968275908460545').members.size;
		const alumni = guild.roles.cache.get('441968596168736779').members.size;
		const facultystaff = guild.roles.cache.get('684770654666489895').members.size;
		const affiliates = guild.roles.cache.get('676583171134980141').members.size;
		const skywarn = guild.roles.cache.get('741969678775222403').members.size;
		const bots = guild.roles.cache.get('543619075683647499').members.size;

		// Reply to the user.
		msg.reply([
			'= ROSTER =\n',
			`• Unlicensed :: ${unlicensed}`,
			`• Novices    :: ${novices}`,
			`• Techs      :: ${techs}`,
			`• Generals   :: ${generals}`,
			`• Advanced   :: ${advanced}`,
			`• Extra      :: ${extra}`,
			`• Licensed   :: ${licensed} (${novices + techs + generals + advanced + extra})`,
			'\n',
			`• Advisors      :: ${advisors}`,
			`• Officers      :: ${officers}`,
			`• Moderators    :: ${moderators}`,
			`• Students      :: ${students}`,
			`• Alumni        :: ${alumni}`,
			`• Faculty/Staff :: ${facultystaff}`,
			`• Affiliates    :: ${affiliates}`,
			'\n',
			`• Skywarn Spotters :: ${skywarn}`,
			`• Bots             :: ${bots}`,
			'\n',
			`• Student Ratio :: ${(Math.round(((students / (students + alumni)) + Number.EPSILON) * 100)).toFixed(2)}%`,
		].join('\n'), { code: 'asciidoc' });
	}
};
