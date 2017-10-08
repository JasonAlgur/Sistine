const moment = require('moment')
require('moment-duration-format')
const snekfetch = require('snekfetch')
const { dBotsPW, dBotsORG } = require('../keys.json')

class Util {
  /* eslint-disable no-console */
  static dBots (count) {
    snekfetch
      .post('https://bots.discord.pw/api/bots/353929487018229762/stats')
      .set({
        Authorization: dBotsPW,
      })
      .send({
        server_count: count,
        shard_count: 2,
      })
      .then(() => {
        console.log('[DBOTS] Successfully posted to Discord Bots.')
      })
      .catch((err) => {
        console.log(`[DBOTS] Failed to post to Discord Bots. ${err}`)
      })
  }

  static dBotsOrg (count) {
    snekfetch
      .post('https://discordbots.org/api/bots/353929487018229762/stats')
      .set({
        Authorization: dBotsORG,
      })
      .send({
        server_count: count,
        shard_count: 2,
      })
      .then(() => {
        console.log('[DBOTSORG] Successfully posted to Discord Bots Org.')
      })
      .catch((err) => {
        console.log(`[DBOTSORG] Failed to post to Discord Bots Org. ${err}`)
      })
  }

  static sendStats (client) {
    const dd = client.datadog
    const manager = client.shard

    manager.fetchClientValues('guilds.size')
      .then((results) => { dd.gauge('client.guilds', results.reduce((prev, val) => prev + val, 0)) }).catch(console.error)

    dd.gauge('client.ping', client.ping)
    manager.fetchClientValues('users.size')
      .then((results) => { dd.gauge('client.users', results.reduce((prev, val) => prev + val, 0)) }).catch(console.error)
    manager.fetchClientValues('channels.size')
      .then((results) => { dd.gauge('client.channels', results.reduce((prev, val) => prev + val, 0)) }).catch(console.error)
    dd.gauge('node.memory', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))
  }

  static list (arr, conj = 'and') {
    const { length } = arr
    return `${arr.slice(0, -1).join(', ')}${length > 1 ? `${length > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`
  }

  /**
* Split a string by its latest space character in a range from the character 0 to value/
* @param {string} str    The text to split.
* @param {number} length The length of the desired string.
* @returns {string}
* @static
*/
  static splitText (str, length) {
    const x = str.substring(0, length).lastIndexOf(' ')
    const pos = x === -1 ? length : x
    return str.substring(0, pos)
  }

  /**
* Show time duration in an un-trimmed h:mm:ss format.
* @param {number} duration Duration in milliseconds.
* @returns {string}
*/
  static showSeconds (duration) {
    return moment.duration(duration).format('h:mm:ss', {
      trim: false,
    })
  }

  static announcement (msg) {
    const announcementID = '338768714428186624'
    if (announcementID === null) throw msg.language.get('COMMAND_SUBSCRIBE_NO_ROLE')
    const role = msg.guild.roles.get(announcementID)
    if (!role) throw msg.language.get('COMMAND_SUBSCRIBE_NO_ROLE')
    if (role.position >= msg.guild.me.highestRole.position) throw msg.language.get('SYSTEM_HIGHEST_ROLE')
    return role
  }

  static updateStatus (client) {
    client.user.setPresence({ activity: { name: `${client.shard.id + 1 || 'Dev'}-${client.guilds.size} | s>help | sistine.ml`, url: 'https://twitch.tv/akashicsrecords', type: 1 } }).catch((err) => {
      client.emit('log', err, 'error')
    })
  }
}

module.exports = Util
