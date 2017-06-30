const { CommandoClient } = require('discord.js-commando');
const path = require('path');
var CONFIG = require('./config.json');
var db = require('./database/_db.js');
var User = require('./database/user.js');

db.sync();

const client = new CommandoClient({
    commandPrefix: '=',
    owner: '206136363836243968',
    disableEveryone: true,
    unknownCommandResponse: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['activity', 'Bots Activity commands.'],
        ['admin', 'Bots Admin commands.']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    client.user.setGame('LGDiscord');
});

//Counts user Posts
client.on('message', (msg) => {
  if(!msg.author.bot){
    if(msg.content.length > 10){
      User.findOne({ where: {username: msg.author.username}}).then(usr => {
        if(usr === null){
          var roles;
          msg.member.roles.forEach(function(role){
            roles += role.name + " ";
          });
          User.create({username:msg.author.username, postcount: 1, groups: roles});
        }
        else{
          var currentDate = new Date();
          if(usr.createdAt.getMonth() !== currentDate.getMonth()){
            User.findOne({ where: {username: msg.author.username}}).then(usr => {
              var currentDate = new Date();
              User.findAll({where: {}}).then(usrs => {
                client.channels.find('name', 'activitylog').send('Logging Last Month Messages Here! Users post count have been reset!');
                var copy = Object.assign([], usrs);

                var post = "";
                copy.forEach(function(user){
                  post += user.username + ' has a post count of: ' + user.postcount + '\n';
                  if(post.length > 1500){
                    client.channels.find('name', 'activitylog').send(post);
                    post = "";
                  }
                });

                if(post.length > 0){
                  client.channels.find('name', 'activitylog').send(post);
                }

                User.destroy({ where: {}}).then(function(){});
              });
            });
          }
          else{
            var upCount = usr.postcount + 1;
            User.update(
              { postcount: upCount },
              { where: { username: usr.username } }
            );
          }
        }
      });
    }
  }
});

//If user groups change
client.on('guildMemberUpdate', (oldMember, newMember) => {
  var groups = "";
  newMember._roles.forEach(function(role){
      groups += newMember.guild.roles.find('id', role).name + " ";
  });
  User.update({ groups: groups }, { where: { username: newMember.user.username }})
});

client.login(CONFIG.discordToken);
