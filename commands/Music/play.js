const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      runIn: ['text'],

      description: 'Let\'s start the queue!',
    });

    this.delayer = (time) => { new Promise(res => setTimeout(() => res(), time)); };
  }

  async run(msg) {
    const musicInterface = msg.guild.music;

    if (musicInterface.queue.length === 0) {
      return msg.send(`Add some songs to the queue first with ${msg.guild.settings.prefix}add`);
    }
    if (!musicInterface.dispatcher || !musicInterface.voiceChannel) await this.client.commands.get('join').run(msg);
    if (musicInterface.status === 'paused') { await this.client.commands.get('resume').run(msg); }
    if (musicInterface.status === 'playing') { return msg.send('Already Playing'); }
    musicInterface.status = 'playing';
    musicInterface.channel = msg.channel;
    return this.play(musicInterface, msg);
  }

  async play(musicInterface, msg) {
    if (musicInterface.status !== 'playing') return null;

    const song = musicInterface.queue[0];

    if (!song) {
      if (musicInterface.autoplay) {
        return this.autoPlayer(musicInterface).then(() => this.play(musicInterface, msg));
      }
      return musicInterface.channel.send('⏹ Queue is empty').then(() => musicInterface.destroy());
    }

    await musicInterface.channel.send(msg.language.get('MUSIC_PLAY', song));
    await this.delayer(300);

    return musicInterface.play()
      .then(
        dispatcher => dispatcher
          .on('end', () => {
            musicInterface.skip();
            this.play(musicInterface, msg);
          })
          .on('error', (err) => {
            musicInterface.channel.send(msg.language.get('MUSIC_ERR', song));
            musicInterface.client.emit('log', err, 'error');
            musicInterface.skip();
            this.play(musicInterface, msg);
          }),
        (message) => {
          musicInterface.channel.send(message);
          musicInterface.destroy();
        },
      );
  }

  autoPlayer(musicInterface) {
    return musicInterface.add('Autoplay', musicInterface.next);
  }

};
