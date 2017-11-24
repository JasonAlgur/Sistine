const { Event } = require('klasa');

module.exports = class Message extends Event {

	async run(msg) {
		if (!this.client.ready) return;

		this.client.stats.increment('client.messages');
		if (this.client.blocklist.includes(msg.author.id)) return;
		this.client.monitors.run(msg);
	}

};
