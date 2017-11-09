const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class Blacklist extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			permLevel: 10,
			description: 'Blacklist a guild, preventing guild creation.',
			usage: '<add|remove> <GuildIdentifier:guild|GuildID:str>',
			usageDelim: ' '
		});
	}

	async run(msg, [addremove, guild]) {
		const { blacklist } = this.client;
		switch (addremove) {
			case 'add':
				if (blacklist.includes(guild.id)) {
					return msg.send(`<:tickNo:373304949234204682> \`${guild}\` is already blacklisted.`);
				}
				await this.client.blacklist.push(guild.id);
				await writeJSONAtomic('./keys/blacklist.json', this.client.blacklist);
				return msg.send(`<:tickYes:373305832793833483> Guild \`${guild}\` was added to the blacklist.`);
			case 'remove':
				if (!blacklist.includes(guild.id)) {
					return msg.send(`<:tickNo:373304949234204682> \`${guild}\` is not blacklisted.`);
				}
				await blacklist.splice(blacklist.indexOf(guild.id));
				await writeJSONAtomic('./keys/blacklist.json', this.client.blacklist);
				return msg.send(`<:tickYes:373305832793833483> Guild \`${guild}\` was removed from the blacklist.`);
		}
		return msg.send('There were no valid options. Please try again.');
	}

};