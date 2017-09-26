const { Event } = require('klasa');
const { dBots, dBotsOrg } = require('../util/Util');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'guildCreate', enabled: true });
  }

  async run(guild) {
    if (this.client.banlist.hasOwnProperty(guild.id)) {
      await guild.leave();
    }

    this.client.datadog.gauge('client.guildJoin');

    dBots(this.client.guilds.size);
    dBotsOrg(this.client.guilds.size);

    this.client.user.setActivity(`sistine.ml | s>help | ${this.client.guilds.size} guilds`).catch((err) => {
      this.client.emit('log', err, 'error');
    });

    this.client.channels.get('341768632545705986').send(`<:tickYes:315009125694177281> Joined \`"${guild.name}" (${guild.id})\` with ${guild.memberCount} members owned by \`${guild.owner.user.tag}\``);
  }

};
