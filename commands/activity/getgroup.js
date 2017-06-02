const { Command } = require('discord.js-commando');
var User = require('./../../database/user.js');

module.exports = class GetUserCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'getgroup',
            aliases: ['group'],
            group: 'activity',
            memberName: 'getgroup',
            description: 'Gets all users for specific group.',
            examples: ['getgroup <groupname>'],
            args: [
                {
                    key: 'groupname',
                    prompt: 'What group?',
                    type: 'string',
                    validate: text => {
                        if (text.length < 30 && text.length > 2) return true;
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
      const { groupname } = args;
      var query = '%'+ groupname + '%';
      User.findAll({ where: {groups: {$like: query}}, order: '"username" DESC'}).then(grps => {
        if(grps === null){
          return msg.channel.send(groupname + ' returned back no members.');
        }
        else{
          var users = "";
          grps.forEach(function(group){
            users += group.username + ' has a post count of: ' + group.postcount + '\n';
          });

          return msg.author.send(users);
        }
      });
    }
};
