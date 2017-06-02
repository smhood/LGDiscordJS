const { Command } = require('discord.js-commando');

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'admin',
            memberName: 'purge',
            description: 'Remove all non members..',
            examples: ['purge true/false'],
            args: [
                {
                    key: 'kick',
                    prompt: 'What user?',
                    type: 'boolean',
                    default: false
                }
            ]
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

    async run(msg, args) {
      const { kick } = args;

      var badMembers = msg.guild.members.filter(function(member){
        var date = new Date(member.joinedTimestamp);
        var currentDate = new Date();
        date.setDate(date.getDate() + 3);
        if(member.roles.array().length === 1){
          if(date < currentDate){
            if(msg.member.voiceChannel === null){
              return true;
            }
          }
        }
      });

      badMembers.forEach(function(member){
        if(kick){
          member.kick();
        }
      });

      return msg.channel.send("Removing following people: " + badMembers.array().toString());
    }
};
