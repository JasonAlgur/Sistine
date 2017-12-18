const { Command } = require('klasa');

function alternateCase(string) {
	const chars = string.toUpperCase().split('');
	for (let i = 0; i < chars.length; i += 2) {
		chars[i] = chars[i].toLowerCase();
	}
	return chars.join('');
};

module.exports = class Mock extends Command {

	constructor(...msgid) {
		super(...msgid, {
			cooldown: 5,
			description: 'Mocks a nominated message.',
			usage: '[MessageID:msg]'
		});
		this.cost = 15;
	}

	async run(msg, [msgid]) {
		const grabMock = msgid || await msg.channel.messages.fetch({ limit: 1, before: msg.id });
		const mock = grabMock.size === 1 ? grabMock.first() : grabMock;
		const author = await msg.guild.members.fetch(mock.author);
		if (author.user.bot) throw msg.language.get('COMMAND_MOCK_ERROR');
		await msg.channel.send(alternateCase(mock.cleanContent), { files: [{ attachment: './assets/images/spongebob.png', name: 'mock.png' }] });
	}

};