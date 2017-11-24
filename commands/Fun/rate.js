const { Command } = require('klasa');

module.exports = class Rate extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rate-waifu'],
			description: 'Rates your Waifu!',
			usage: '<Query:Str>'
		});
		this.cost = 15;
	}

	async run(msg, [user]) {
		let rate;

		if (/^(you|yourself|sistine)$/i.test(user)) {
			return msg.send(msg.language.get('rateMyself'));
		} else {
			if (/^(myself|me)$/i.test(user)) user = msg.author.username;
			else user = user.replace(/\bmy\b/g, 'your');

			const bg = Buffer.from(user.toLowerCase()).readUIntBE(0, user.length);
			const rng = user.length * Math.abs(Math.sin(bg)) * 10;
			rate = 100 - Math.round((bg * rng) % 100);
		}
		return msg.send(msg.language.get('rateWaifu', user, rate));
	}

};
