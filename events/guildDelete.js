const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus } = require('../util/Util');

module.exports = class guildDelete extends Event {

	constructor(...args) {
		super(...args, { name: 'guildDelete', enabled: true });
	}

	run(guild) {
		this.client.emit('log', `Guild Leave: ${guild.name}[${guild.id}]`);
		this.client.stats.increment('client.guildLeaves');
		this.client.stats.gauge('client.guilds', this.client.guilds.size);

		dBots(this.client);
		dBotsOrg(this.client);
		updateStatus(this.client);
	}

};
