const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Searches Discord Bots for information on a bot.',
			usage: '<Bot:user>'
		});
	}

	async run(msg, args) {
		const bot = args[0];
		try {
			const { body } = await snekfetch
				.get(`https://discordbots.org/api/bots/${bot.id}`);
			const build = new this.client.methods.Embed()
				.setColor(0x9797FF)
				.setAuthor('discordbots.org', 'https://discordbots.org/')
				.setTitle(body.username)
				.setURL(`https://discordbots.org/bots/${bot.id}`)
				.setDescription(body.shortdesc)
				.addField(
					'❯ Library',
					body.lib, true,
				)
				.addField(
					'❯ Prefix',
					body.prefix, true,
				)
				.addField(
					'❯ Invite',
					`[Here](${body.invite})`, true,
				)
				.addField('❯ Website', body.website || 'No Website', true)
				.addField(
					'❯ Updoots',
					body.points, true,
				)
				.addField(
					'❯ Server Count',
					body.server_count, true,
				);
			return msg.sendEmbed(build);
		} catch (err) {
			if (err.status === 404) return msg.send('Could not find any results.');
			return msg.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

};
