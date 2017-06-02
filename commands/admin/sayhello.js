const { Command } = require('discord.js-commando');
var User = require('./../../database/user.js');

module.exports = class SayHello extends Command {
    constructor(client) {
        super(client, {
            name: 'sayhello',
            aliases: ['hi'],
            group: 'admin',
            memberName: 'sayhello',
            description: 'Place holder for general commands.',
            examples: ['sayhello']
        });
    }

    hasPermission(msg) {
      if(msg.member.roles.exists('name', 'Officer') || this.client.isOwner(msg.author)){
        return true;
      }
      else{
        return false;
      }
    }

    async run(msg) {
      var date = new Date();
      return msg.channel.send(date.toString());
    }
};
