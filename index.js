'use strict';


// Imports the Node.js file system library.
const fs = require('fs');


// Imports the Node.js path library.
const path = require('path');


// Imports the SQLite3 library and 'open' from the SQLite library.
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


// Imports 'version' from the Discord.js library.
const discord = require('discord.js').version;


// Imports 'SapphireClient' from the Sapphire library.
const { SapphireClient } = require('@sapphire/framework');


// Imports the Logger module.
const Logger = require('./modules/Logger');


// Loads the config file.
const config = require('./config');


// Creates a logs directory if it does not exist.
if (!fs.existsSync('./logs')) {
	fs.mkdirSync('./logs');
}


// Creates a db directory if it does not exist.
if (!fs.existsSync('./db')) {
	fs.mkdirSync('./db');
}


// Creates the Sapphire Client.
const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
console.log(client);

// Attaches the config file to the bot.
client.config = config;


// Attaches the Logger module to the bot.
client.logger = Logger;


// Ready event.
client.on('ready', () => {
	// Sets the bots activity.
	client.user.setActivity('Amateur Radio Club');

	// Log event.
	client.logger.log([
		'Online',
		`Username: ${client.user.tag}`,
		`Servers: ${client.guilds.cache.size}`,
		`Channels: ${client.channels.cache.filter(channel => channel.type !== 'category').size}`,
		`Users: ${client.users.cache.filter(user => !user.bot).size}`,
		`Node.js: ${process.version}`,
		`Discord.js: v${discord}`,
	].join(' | '), 'start');
});


// Message event.
client.on('messageCreate', (msg) => {
	// Return if author is a bot.
	if (msg.author.bot) {
		return;
	}

	const content = msg.content;

	// // Amazon.
	// if (content.match(/amazon/gi)) {
	// 	const pattern = new RegExp(/(?<=(http[s]?:\/\/)?(www\.)?amazon\.[\w.]+\/([\w-]+\/|)(dp|gp)\/)([\w]{10})/gi);

	// 	if (content.match(pattern)) {
	// 		const result = content.match(pattern);

	// 		try {
	// 			const nickname = msg.guild.members.cache.get(msg.author.id).displayName;
	// 			console.log(nickname);
	// 			let links = `**${nickname}:** `;

	// 			for (let i = 0; i < result.length; i++) {
	// 				links += `<https://amzn.com/${result[i]}>\n`;
	// 			}

	// 			msg.channel.send(links);
	// 		}
	// 		catch (e) {
	// 			// Log the error.
	// 			client.logger.log(e, 'error');
	// 		}
	// 	}
	// }

	// // eBay.
	// if (content.match(/ebay/gi)) {
	// 	const pattern = new RegExp(/(?<=(http[s]?:\/\/)?(www\.)?ebay\.[\w.]+\/itm\/[\w-]+\/)([\w]{12})/gi);

	// 	if (content.match(pattern)) {
	// 		const result = content.match(pattern);

	// 		try {
	// 			const nickname = msg.guild.members.cache.get(msg.author.id).displayName;
	// 			let links = `**${nickname}:** `;

	// 			for (let i = 0; i < result.length; i++) {
	// 				links += `<https://ebay.com/itm/${result[i]}>\n`;
	// 			}

	// 			msg.channel.send(links);
	// 		}
	// 		catch (e) {
	// 			// Log the error.
	// 			client.logger.log(e, 'error');
	// 		}
	// 	}
	// }

	// // Reddit.
	// if (content.match(/reddit/gi)) {
	// 	const comment = new RegExp(/(http[s]?:\/\/)?(www\.)?reddit\.[\w.]+\/r\/[\w]+\/comments\/[\w]{6}\/[\w]+\/[\w]{7}/gi);
	// 	const thread = new RegExp(/(?<=(http[s]?:\/\/)?(www\.)?reddit\.[\w.]+\/r\/[\w]+\/comments\/)([\w]{6})(?=\/[\w]+[/]?([^\S]+|$))/gi);

	// 	if (content.match(comment)) {
	// 		const result = content.match(comment);
	// 		const results = [];

	// 		for (let i = 0; i < result.length; i++) {
	// 			results.push([result[i].match(/(?<=(http[s]?:\/\/)?(www\.)?reddit\.[\w.]+\/r\/[\w]+\/comments\/)([\w]{6})/gi),
	// 				result[i].match(/(?<=(http[s]?:\/\/)?(www\.)?reddit\.[\w.]+\/r\/[\w]+\/comments\/[\w]{6}\/[\w]+\/)([\w]{7})/gi)]);
	// 		}

	// 		try {
	// 			const nickname = msg.guild.members.cache.get(msg.author.id).displayName;
	// 			let links = `**${nickname}:** `;

	// 			for (let i = 0; i < results.length; i++) {
	// 				links += `<https://reddit.com/comments/${results[i][0]}/_/${results[i][1]}>\n`;
	// 			}

	// 			msg.channel.send(links);
	// 		}
	// 		catch (e) {
	// 			// Log the error.
	// 			client.logger.log(e, 'error');
	// 		}
	// 	}

	// 	if (content.match(thread)) {
	// 		const result = content.match(thread);

	// 		try {
	// 			const nickname = msg.guild.members.cache.get(msg.author.id).displayName;
	// 			let links = `**${nickname}:** `;

	// 			for (let i = 0; i < result.length; i++) {
	// 				links += `<https://redd.it/${result[i]}>\n`;
	// 			}

	// 			msg.channel.send(links);
	// 		}
	// 		catch (e) {
	// 			// Log the error.
	// 			client.logger.log(e, 'error');
	// 		}
	// 	}
	// }
});


// Guild create event.
client.on('guildCreate', guild => {
	// Sets the bots activity.
	client.user.setActivity('Amateur Radio Club');

	// Logs the event.
	client.logger.log([
		`Server: ${guild} (${guild.id})`,
		//`Owner: ${guild.owner.user.tag} (${guild.owner.id})`,
		`Channels: ${guild.channels.cache.filter(channel => channel.type !== 'dm' && channel.type !== 'category').size}`,
		`Users: ${guild.members.cache.filter(member => !member.user.bot).size}`,
	].join(' | '), 'gjoin');
});


// Guild leave event.
client.on('guildDelete', guild => {
	// Sets the bots activity.
	client.user.setActivity('Amateur Radio Club');

	// Logs the event.
	client.logger.log([
		`Server: ${guild} (${guild.id})`,
		//`Owner: ${guild.owner.user.tag} (${guild.owner.id})`,
		`Users: ${guild.members.cache.filter(member => !member.user.bot).size}`,
	].join(' | '), 'gleft');
});


// Discord.js error event.
client.on('error', err => {
	client.logger.log(err, 'error');
});


// Logs the bot into the Discord API.
client.login(client.config.token);
