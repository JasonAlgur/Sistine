const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: ['ATTACH_FILES'],
			description: 'Show off your stamp of approval.',
			usage: '[User:username]'
		});
	}

	async run(msg, [user = msg.author]) {
		const image = await this.client.idioticApi.approved(user.displayAvatarURL({ format: 'png', size: 512 }));
		return msg.channel.sendFile(image, 'approved.png');
	}

};
