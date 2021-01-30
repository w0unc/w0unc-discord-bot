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


// Imports 'CommandoClient', 'SQLiteProvider', and 'version' from the Discord.js Commando library.
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const commando = require('discord.js-commando').version;


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


// Creates a Discord.js Commando client.
const client = new CommandoClient({
	owner: config.owner,
	commandPrefix: config.commandPrefix,
	disableEveryone: config.disableEveryone,
});


// Creates the command groups.
client.registry
	.registerDefaults()
	.registerGroups([
		['debug', 'Debug'],
		['moderate', 'Moderate'],
		['music', 'Music'],
		['radio', 'Radio'],
		['time', 'Time'],
		['tools', 'Tools'],
	])
	.registerCommandsIn(path.join(__dirname, 'commands'));


// Creates a database for storing settings.
client.setProvider(
	open({
		filename: './db/bot.db',
		driver: sqlite3.Database,
	}).then((db) => new SQLiteProvider(db)),
);


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
		`Commando: v${commando}`,
	].join(' | '), 'start');
});


// Message event.
client.on('message', (msg) => {
	// Return if author is a bot.
	if (msg.author.bot) {
		return;
	}

	const content = msg.content;

	// Amazon.
	if (content.match(/amazon/gi)) {
		const pattern = new RegExp(/(?<=(http[s]?:\/\/)?(www\.)?amazon\.[\w.]+\/([\w-]+\/|)(dp|gp)\/)([\w]{10})/gi);

		if (content.match(pattern)) {
			const result = content.match(pattern);

			try {
				const nickname = msg.guild.members.cache.get(msg.author.id).displayName;
				console.log(nickname);
				let links = `**${nickname}:** `;

				for (let i = 0; i < result.length; i++) {
					links += `<https://amzn.com/${result[i]}>\n`;
				}

				msg.channel.send(links);
			}
			catch (e) {
				// Log the error.
				client.logger.log(e, 'error');
			}
		}
	}

	// eBay.
	if (content.match(/ebay/gi)) {
		const pattern = new RegExp(/(?<=(http[s]?:\/\/)?(www\.)?ebay\.[\w.]+\/itm\/[\w-]+\/)([\w]{12})/gi);

		if (content.match(pattern)) {
			const result = content.match(pattern);

			try {
				const nickname = msg.guild.members.cache.get(msg.author.id).displayName;
				let links = `**${nickname}:** `;

				for (let i = 0; i < result.length; i++) {
					links += `<https://ebay.com/itm/${result[i]}>\n`;
				}

				msg.channel.send(links);
			}
			catch (e) {
				// Log the error.
				client.logger.log(e, 'error');
			}
		}
	}

	// Reddit.
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


// Command event.
client.on('commandRun', (cmd, p, msg, args) => {
	if (msg.guild) {
		// If the command is run in a guild.
		client.logger.log([
			`Server: ${msg.guild.name} (${msg.guild.id})`,
			`Channel: ${msg.channel.name} (${msg.channel.id})`,
			`User: ${msg.author.tag} (${msg.author.id})`,
			`Command: ${cmd.name}`,
			`Arguments: ${Object.values(args).join(', ')}`,
		].join(' | '), 'cmdsv');
	}
	else {
		// If the command is run in a DM.
		client.logger.log([
			`User: ${msg.author.tag} (${msg.author.id})`,
			`Command: ${cmd.name}`,
			`Arguments: ${Object.values(args).join(', ')}`,
		].join(' | '), 'cmddm');
	}
});


// Command error event.
client.on('commandError', (cmd, err) => {
	client.logger.log(err.stack, 'error');
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
