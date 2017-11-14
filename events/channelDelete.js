const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name: 'channelDelete', enabled: true });
	}

	run() {
		this.client.stats.gauge('client.channels', this.client.channels.size);
	}

};
