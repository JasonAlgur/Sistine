const moment = require('moment');
require('moment-duration-format');
const snekfetch = require('snekfetch');

class Util {

	/* eslint-disable camelcase */
	static dBots(client) {
		snekfetch
			.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
			.set({ Authorization: client.keys.dBotsPW })
			.send({ server_count: client.guilds.size })
			.catch((err) => {
				client.console.error(`[DBOTS] Failed to post to Discord Bots. ${err}`);
			});
	}

	static dBotsOrg(client) {
		snekfetch
			.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
			.set({ Authorization: client.keys.dBotsORG })
			.send({ server_count: client.guilds.size })
			.catch((err) => {
				client.console.error(`[DBOTSORG] Failed to post to Discord Bots Org. ${err}`);
			});
	}

	static terminalINK(client) {
		snekfetch
			.post(`https://ls.terminal.ink/api/v1/bots/${client.user.id}`)
			.set({ Authorization: client.keys.terminalINK })
			.send({ server_count: client.guilds.size })
			.catch((err) => {
				client.console.error(`[TerminalINK] Failed to post to ls.terminal.ink. ${err}`);
			});
	}

	static list(arr, conj = 'and') {
		const { length } = arr;
		return `${arr.slice(0, -1).join(', ')}${length > 1 ? `${length > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}

	static splitText(str, length) {
		const textLength = str.substring(0, length).lastIndexOf(' ');
		const pos = textLength === -1 ? length : textLength;
		return str.substring(0, pos);
	}

	static showSeconds(duration) {
		return moment.duration(duration).format('h:mm:ss', { trim: false });
	}

	static announcement(msg) {
		const announcementID = msg.guild.configs.roles.subscriberRole;
		if (announcementID === null) { throw msg.language.get('COMMAND_SUBSCRIBE_NO_ROLE'); }
		const role = msg.guild.roles.get(announcementID);
		if (!role) throw msg.language.get('COMMAND_SUBSCRIBE_NO_ROLE');
		if (role.position >= msg.guild.me.highestRole.position) { throw msg.language.get('SYSTEM_HIGHEST_ROLE'); }
		return role;
	}

	static updateStatus(client) {
		client.user.setPresence({ activity: { name: `${client.shard ? client.shard.id + 1 : '1'}—${client.guilds.size} guilds ᐀ sistine.ml`, url: 'https://twitch.tv/kashalles', type: 3 } })
			.catch((err) => {
				client.emit('log', err, 'error');
			});
	}

	static async weebImage(msg, client, action) {
		const imageRequest = await snekfetch.get(`https://api.weeb.sh/images/random?type=${msg.command.name}`)
			.set('Authorization', `Bearer ${client.keys.weebKey}`)
			.catch(error => client.emit('error', `WEEBIMAGE: ${error}`));

		return new client.methods.Embed()
			.setColor('PURPLE')
			.setImage(imageRequest.body.url)
			.setDescription(action);
	}

	static async haste(input, extension) {
		return new Promise((res, rej) => {
			if (!input) rej('Input argument is required.');
			snekfetch.post('https://hastebin.com/documents').send(input).then(body => {
				res(`https://hastebin.com/${body.body.key}${extension ? `.${extension}` : ''}`);
			}).catch((error) => rej(error));
		});
	}

}

module.exports = Util;