const { Inhibitor } = require('klasa')

module.exports = class extends Inhibitor {
  constructor (...args) {
    super(...args, { spamProtection: true })
  }

  async run (msg, cmd) {
    /* eslint-disable no-throw-literal */
    if (!cmd.requireMusic) return

    if (msg.channel.type !== 'text') throw 'This command may be only executed in a server.'

    if (!msg.member.voiceChannel) throw 'You are not connected in a voice channel.'
    if (!msg.guild.me.voiceChannel) throw 'I am not connected in a voice channel.'
    if (msg.member.voiceChannel.id !== msg.guild.me.voiceChannel.id) throw 'You must be in the same voice channel as me.'
  }
}
