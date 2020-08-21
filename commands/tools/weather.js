'use strict';


// Imports the Moment.js Timezone library.
const moment = require('moment-timezone');


// Imports 'MessageEmbed' from the Discord.js library.
const { MessageEmbed } = require('discord.js');


// Imports 'Command' from the Discord.js Commando library.
const { Command } = require('discord.js-commando');


// Imports the APICall module.
const APICall = require('../../modules/APICall');


// Command that displays weather in an area.
module.exports = class Status extends Command {
	constructor(client) {
		super(client, {
			name: 'weather',
			group: 'tools',
			memberName: 'weather',
			description: 'Displays weather in an area.',
			examples: [
				'weather New_York',
				'weather 48.8567,2.3508',
				'weather 28223',
				'weather SW1',
				'weather G2J',
				'weather metar:EGLL',
				'weather iata:DXB',
				'weather 100.0.0.1',
			],
			throttling: {
				usages: 1,
				duration: 10,
			},
			args: [
				{
					key: 'location',
					prompt: 'Please specify a location for retrieving weather.',
					type: 'string',
					max: 50,
					min: 1,
				}, {
					key: 'units',
					label: '"m"/"f"/"s"',
					prompt: 'Please specify the units.',
					type: 'string',
					default: 'm',
					oneOf: ['m', 'f', 's'],
				},
			],
		});
	}

	// The main run function of the Weather command.
	async run(msg, { location, units }) {
		// Returns if the Weatherstack API key is missing.
		if (!this.client.config.weatherstackAPIKey) {
			msg.reply([
				'An error occurred while running the command: `Weather`',
				'You shouldn\'t ever receive an error like this.',
				`Please contact ${this.client.owners || 'the bot owner'}`,
				`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : '.'}`,
			].join('\n'));

			// Log the error.
			this.client.logger.log('Weatherstack API key is missing.', 'error');
		}

		location = location.replace(/\s/g, '');
		units = units.toUpperCase();

		// API call options.
		const options = {
			host: 'api.weatherstack.com',
			path: `/current?access_key=${this.client.config.weatherstackAPIKey}&query=${location}&units=${units}`,
			encryption: false,
		};

		// API call.
		APICall.call(options, (err, result, statusCode) => {
			if (err || statusCode === 404) {
				// Reply to the user if error.
				console.log(this.client.config);
				msg.reply([
					'An error occurred while running the command: `Weather`',
					'You shouldn\'t ever receive an error like this.',
					`Please contact ${this.client.owners || 'the bot owner'}`,
					`${this.client.config.invite ? `In this server: https://discord.gg/${this.client.config.invite}` : ''}`,
				].join('\n'));

				// Log the error.
				return this.client.logger.log(err, 'error');
			}

			// Parse the data into JSON.
			const data = JSON.parse(result);

			// API error handling.
			if (data.error && data.error.code) {
				return msg.reply(`${data.error.code}: ${data.error.info}`);
			}

			// For sending a RichEmbed message.
			const sendEmbed = new MessageEmbed();

			// City and country.
			sendEmbed.setTitle(
				`${data.location.name.toUpperCase()}, ${data.location.country.toUpperCase()}`,
			);

			// Description.
			sendEmbed.setDescription(data.current.weather_descriptions[0]);

			// Image.
			sendEmbed.setThumbnail(`${data.current.weather_icons[0]}`);

			// Region.
			if (data.location.region) {
				sendEmbed.addField('REGION', data.location.region, true);
			}

			// Latitude and Longitude.
			sendEmbed.addField('LAT/LON', `${data.location.lat}, ${data.location.lon}`, true);

			// Time and timezone.
			sendEmbed.addField(
				`TIME: ${moment().tz(data.location.timezone_id).format('hh:mm A')}`,
				data.location.timezone_id,
				true,
			);

			const temp = data.current.temperature;
			let tempClass = null;

			// Metric.
			if (units === 'M') {
				// Temperature class.
				if (temp < -10) {
					tempClass = 'Frigid';
				}
				else if (temp >= -10 && temp < 0) {
					tempClass = 'Freezing';
				}
				else if (temp >= 0 && temp < 10) {
					tempClass = 'Cold';
				}
				else if (temp >= 10 && temp < 20) {
					tempClass = 'Cool';
				}
				else if (temp >= 20 && temp < 22) {
					tempClass = 'Comfortable';
				}
				else if (temp >= 22 && temp < 30) {
					tempClass = 'Warm';
				}
				else if (temp >= 30 && temp < 40) {
					tempClass = 'Hot';
				}
				else {
					tempClass = 'Scorching';
				}

				// Temperature.
				sendEmbed.addField(
					`TEMPERATURE: ${data.current.temperature}°C`,
					`Feels Like: ${data.current.feelslike}°C (${tempClass})`,
					true,
				);

				// Wind.
				sendEmbed.addField(
					`WIND: ${data.current.wind_degree}@${data.current.wind_speed} kph`,
					`Pressure: ${data.current.pressure} mb`,
					true,
				);

				// Visibility.
				sendEmbed.addField(
					`VISIBILITY: ${data.current.visibility} km`,
					`Cloud Cover: ${data.current.cloudcover}%`,
					true,
				);

				// Precipitation.
				sendEmbed.addField(
					'PRECIPITATION',
					`${data.current.precip} mm`,
					true,
				);
			// Fahrenheit.
			}
			else if (units.toUpperCase() === 'F') {
				// Temperature class.
				if (temp < 14) {
					tempClass = 'Frigid';
				}
				else if (temp >= 14 && temp < 32) {
					tempClass = 'Freezing';
				}
				else if (temp >= 32 && temp < 50) {
					tempClass = 'Cold';
				}
				else if (temp >= 50 && temp < 68) {
					tempClass = 'Cool';
				}
				else if (temp >= 68 && temp < 71.6) {
					tempClass = 'Comfortable';
				}
				else if (temp >= 71.6 && temp < 86) {
					tempClass = 'Warm';
				}
				else if (temp >= 86 && temp < 104) {
					tempClass = 'Hot';
				}
				else {
					tempClass = 'Scorching';
				}

				// Temperature.
				sendEmbed.addField(
					`TEMPERATURE: ${data.current.temperature}°F`,
					`Feels Like: ${data.current.feelslike}°F (${tempClass})`,
					true,
				);

				// Wind.
				sendEmbed.addField(
					`WIND: ${data.current.wind_degree}@${data.current.wind_speed} mph`,
					`Pressure: ${data.current.pressure} mb`,
					true,
				);

				// Visibility and cloud cover.
				sendEmbed.addField(
					`VISIBILITY: ${data.current.visibility} mi`,
					`Cloud Cover: ${data.current.cloudcover}%`,
					true,
				);

				// Precipitation.
				sendEmbed.addField(
					'PRECIPITATION',
					`${data.current.precip} in`,
					true,
				);
			}
			// Standard.
			else if (units.toUpperCase() === 'S') {
				// Temperature class.
				if (temp < 263) {
					tempClass = 'Frigid';
				}
				else if (temp >= 263 && temp < 273) {
					tempClass = 'Freezing';
				}
				else if (temp >= 273 && temp < 283) {
					tempClass = 'Cold';
				}
				else if (temp >= 283 && temp < 293) {
					tempClass = 'Cool';
				}
				else if (temp >= 293 && temp < 295) {
					tempClass = 'Comfortable';
				}
				else if (temp >= 295 && temp < 303) {
					tempClass = 'Warm';
				}
				else if (temp >= 303 && temp < 313) {
					tempClass = 'Hot';
				}
				else {
					tempClass = 'Scorching';
				}

				// Temperature.
				sendEmbed.addField(
					`TEMPERATURE: ${data.current.temperature}°K`,
					`Feels Like: ${data.current.feelslike}°K (${tempClass})`,
					true,
				);

				// Wind.
				sendEmbed.addField(
					`WIND: ${data.current.wind_degree}@${data.current.wind_speed} kph`,
					`Pressure: ${data.current.pressure} mb`,
					true,
				);

				// Visibility and cloud cover.
				sendEmbed.addField(
					`VISIBILITY: ${data.current.visibility} km`,
					`Cloud Cover: ${data.current.cloudcover}%`,
					true,
				);

				// Precipitation.
				sendEmbed.addField(
					'PRECIPITATION',
					`${data.current.precip} mm`,
					true,
				);
			}

			// Humidity and UV index.
			sendEmbed.addField(
				`HUMIDITY: ${data.current.humidity}%`,
				`UV INDEX: ${data.current.uv_index}`,
				true,
			);

			// UTC Offset.
			sendEmbed.addField(
				'UTC OFFSET',
				`${data.location.utc_offset} hour(s)`,
				true,
			);

			// Reply to the user.
			msg.reply(sendEmbed);
		});
	}
};
