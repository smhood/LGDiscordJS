const { Command } = require('discord.js-commando');
var User = require('./../../database/user.js');

module.exports = class GetUserCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'getuser',
            aliases: ['get'],
            group: 'activity',
            memberName: 'getuser',
            description: 'Gets user activity.',
            examples: ['getuser <username>'],
            args: [
                {
                    key: 'username',
                    prompt: 'What user?',
                    type: 'string',
                    validate: text => {
                        if (text.length < 14 && text.length > 2) return true;
                        return false;
                    }
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
      const { username } = args;
      User.findOne({ where: {username: username}}).then(usr => {
        if(usr === null){
          return msg.channel.send(username + ' does not exist or has no posts.');
        }
        else{
          return msg.author.send(username + ' has a postcount of: ' + usr.postcount);
        }
      });
    }
};
