const {
	Command
} = require('klasa');
const snekfetch = require('snekfetch');
const keys = require('../../keys.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'botpw',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			requiredSettings: [],
			description: 'Searches Discord Bots for information on a bot.',
			usage: '<Bot:user>',
			usageDelim: undefined,
			extendedHelp: ''
		});
	}

	async run(msg, args) {

		const bot = args[0];
		try {
			const {
				body
			} = await snekfetch
					.get(`https://bots.discord.pw/api/bots/${bot.id}`)
					.set({
						Authorization: keys.apiKey.dBotsPW
					});
			const build = new this.client.methods.Embed()
				.setColor(0x9797FF)
				.setAuthor('Discord Bots', 'https://i.imgur.com/lrKYBQi.jpg')
				.setTitle(body.name)
				.setURL(`https://bots.discord.pw/bots/${bot.id}`)
				.setDescription(body.description)
				.addField('❯ Library',
					body.library, true)
				.addField('❯ Invite',
					`[Here](${body.invite_url})`, true)
				.addField('❯ Prefix',
					body.prefix, true)
				.addField('❯ Website', body.website || 'No Website :C', true);
			return msg.send('', {
				embed: build
			});
		} catch (err) {
			if (err.status === 404) return msg.send('Could not find any results.');
			return msg.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

};