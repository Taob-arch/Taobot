const Discord = require ('discord.js');
const { Canvas, Image } = require('canvas');
const DIG = require("discord-image-generation");
const axios = require('axios');
const sql = require("sqlite");
const https = require('https');
const fetch = require ('node-fetch');
const log = require('log-to-file');
const fs = require('fs');
var Filter = require('bad-words');
const { get } = require('http');
const botsettings = require('./botsettings.json');
const embed = require('discord-embed-maker');
const { uuid } = require('assert-plus');
const bot = new Discord.Client({disableeveryone: true});
bot.login(botsettings.token);
const Botname = "Mee8";
const prefix = "!"
var blockedUsers = ["725297925567152139"];
const rm = require('discord.js-reaction-menu');
const { kill } = require('process');

bot.on('ready', async () =>{
    console.log(Botname + " is online!")
})

filter = new Filter();

bot.on ('message', message => {
    command = message.content.toLowerCase()
    SendMessage=(text) => message.channel.send(text)
    console.log(message.author.tag + " said: " + message.content + " in: " +message.channel)
    if (command.startsWith(prefix + 'clear')) {
        if(message.member.hasPermission('ADMINISTRATOR') || blockedUsers.includes(message.author.id)){
                args = command.split(" ");
                entries = args[1]
                message.channel.delete
                DeleteMessages(message,entries)
            }
            else{
                console.log(message.author.tag + " tried to use Clear command without the correct permissions")
                message.delete({ timeout: 3000 })
                SendMessage("@"+ message.author.tag + " `tried to use Clear command without the correct permissions`")
            }
        }
        if (command == 'block') {
            let user = message.mentions.users.first();
            if (user && !blockedUsers.includes(user.id)) blockedUsers.push(user.id);
          }
        else if (command.startsWith(prefix + 'kick')){
            if(!message.member.guild.me.hasPermission('ADMINISTRATOR')){
                SendMessage("This bot doesn't have permission to do that, Please contact an administrator")
                return
            }
            let args = command.split(" ")
            if (args.length == 2)
            {
                let User = message.guild.member(message.mentions.users.first())
                User.kick()
                SendMessage("YEAHBOIS " + User + " IS NO MORE")
            }
            else if (args.length > 2)
            {
                let User = message.guild.member(message.mentions.users.first())
                let reasonStr = args.slice(2).join(' ')
                console.log(reasonStr)
                User.kick(reasonStr)
                SendMessage("YEAHBOIS " + args[1] + " IS NO MORE")
            }
            else
            {
                SendMessage("Please specify a user to kick")
            }
        }
        else if (command.startsWith(prefix + "rr")){
            SendMessage({embed:{
                title: "Accept to our rules",
                description: "Accept to our rules to gain access to the server",
                }
                
            }).then(function (message) {
                message.react("👍")
              }).catch(function() {
               });
        }

        else if (command.startsWith(prefix + "slap")){
            let args = command.split(" ")
            let mention = message.mentions.users.first;
            message.delete();
                const messages = [" slammed ", " clapped ", " bitch slapped ", " slapped "]
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                SendMessage(message.author.username + randomMessage + args[1])
        }
        else if (command.startsWith(prefix + "echo")){
            message.delete();
            let echo = command.replace("!echo ", "")
            SendMessage(echo)
        }
        else if (command.includes("happy birthday")){
            if(message.author.id == bot.user.id) return;
            SendMessage("Happy birthday! :partying_face:")
            }
        else if (command.startsWith(prefix + "level")){
            let args = command.split(" ")
            var player = args[1]

            if (typeof player === 'undefined') {
                axios.get('https://api.mojang.com/users/profiles/minecraft/' + message.member.nickname).then(response => {
                    var uuid = response.data.id
                        axios.get('https://api.hypixel.net/player?uuid=' + uuid + '&key=7ddb7e29-a0f0-41b7-a6c0-6f916629bdb1').then(tte => {
                        var exp = Math.round(tte.data.player.networkExp)
                        var level = Math.round((Math.sqrt(((2 * exp) + 30625)) / 50) - 2.5)
                        var name = tte.data.player.displayname
                        var stats = tte.data.player.stats
                        Hypixeldata(exp, uuid, level, name, stats)
                        });
                    })
            }
            else{
            {
            axios.get('https://api.mojang.com/users/profiles/minecraft/' + player).then(response => {
            var uuid = response.data.id
                axios.get('https://api.hypixel.net/player?uuid=' + uuid + '&key=7ddb7e29-a0f0-41b7-a6c0-6f916629bdb1').then(tte => {
                var exp = Math.round(tte.data.player.networkExp)
                var level = Math.round((Math.sqrt(((2 * exp) + 30625)) / 50) - 2.5)
                var name = tte.data.player.displayname
                Hypixeldata(exp, uuid, level, name)
                });
            })
            }
        }
      }
      else if(command.startsWith(prefix + "skywars")){
        let args = command.split(" ")
        var player = args[1]
        if (typeof player === 'undefined') {
            axios.get('https://api.mojang.com/users/profiles/minecraft/' + message.member.nickname).then(response => {
                var uuid = response.data.id
                    axios.get('https://api.hypixel.net/player?uuid=' + uuid + '&key=7ddb7e29-a0f0-41b7-a6c0-6f916629bdb1').then(tte => {
                    var deaths = tte.data.player.stats.SkyWars.deaths
                    var killstreak = tte.data.player.stats.SkyWars.killstreak
                    var played = tte.data.player.stats.SkyWars.games_played_skywars
                    var wins = tte.data.player.stats.SkyWars.wins
                    var name = tte.data.player.displayname
                    SkyWarsdata(deaths, killstreak, played, wins, name)
                    });
                })
        }
        else{
            axios.get('https://api.mojang.com/users/profiles/minecraft/' + player).then(response => {
                var uuid = response.data.id
                    axios.get('https://api.hypixel.net/player?uuid=' + uuid + '&key=7ddb7e29-a0f0-41b7-a6c0-6f916629bdb1').then(tte => {
                    var deaths = tte.data.player.stats.SkyWars.deaths
                    var killstreak = tte.data.player.stats.SkyWars.killstreak
                    var played = tte.data.player.stats.SkyWars.games_played_skywars
                    var wins = tte.data.player.stats.SkyWars.wins
                    var name = tte.data.player.displayname
                    SkyWarsdata(deaths, killstreak, played, wins, name)
                    });
                })
        }
      }
      else if(command.startsWith(prefix + "bedwars")){
        let args = command.split(" ")
        var player = args[1]
        if (typeof player === 'undefined') {
            axios.get('https://api.mojang.com/users/profiles/minecraft/' + message.member.nickname).then(response => {
                var uuid = response.data.id
                    axios.get('https://api.hypixel.net/player?uuid=' + uuid + '&key=7ddb7e29-a0f0-41b7-a6c0-6f916629bdb1').then(tte => {
                    var deaths = tte.data.player.stats.Bedwars.final_deaths_bedwars
                    var killstreak = tte.data.player.stats.Bedwars.final_kills_bedwars
                    var wins = tte.data.player.stats.Bedwars.wins_bedwars
                    var name = tte.data.player.displayname
                    BedWarsdata(deaths, killstreak, wins, name)
                    });
                })
        }
        else{
            axios.get('https://api.mojang.com/users/profiles/minecraft/' + player).then(response => {
                var uuid = response.data.id
                    axios.get('https://api.hypixel.net/player?uuid=' + uuid + '&key=7ddb7e29-a0f0-41b7-a6c0-6f916629bdb1').then(tte => {
                    var deaths = tte.data.player.stats.Bedwars.deaths
                    var killstreak = tte.data.player.stats.v.killstreak
                    var played = tte.data.player.stats.Bedwars.games_played_bedwars_1
                    var wins = tte.data.player.stats.Bedwars.wins
                    var name = tte.data.player.displayname
                    BedWarsdata(deaths, killstreak, played, wins, name)
                    });
                })
        }
      }
      
      else if(command.startsWith(prefix + "link")){
        let args = command.split(" ")
        var player = args[1]
        axios.get('https://api.mojang.com/users/profiles/minecraft/' + player).then(response => {
            var uuid = response.data.id
                axios.get('https://api.hypixel.net/player?uuid=' + uuid + '&key=7ddb7e29-a0f0-41b7-a6c0-6f916629bdb1').then(api => {
                    try {
                    var discordlinked = api.data.player.socialMedia.links.DISCORD
                    }
                    catch(err){
                    SendMessage("Error")
                    return(1)
                    }
                    if(discordlinked == message.author.tag){
                        SendMessage("Account succesfully linked to " + player)
                        message.member.setNickname(player)
                    }
                    else{
                        SendMessage("please link your discord to your hypixel profile!") 
                        return(0)
                    }
                    });
            });
      }
    else if (command.startsWith(prefix + "suggest")){
      if(message.author.id === bot.user.id) return;
      let args = command.split(" ")
      if (args.length == 1){
        SendMessage("Please enter a suggestion")
      }
      else{
          let echo = command.replace("!suggest ", "")
          var censoredecho = filter.clean(echo)
          const embed = {
            "title": message.author.username + "'s suggestion:",
            "color": 15801205,
            "timestamp": "2021-01-11T18:35:01.246Z",
            "footer": {
              "text": "Taobot"
            },
            "thumbnail": {},
            "image": {},
            "author": {
              "icon_url": "https://cdn.discordapp.com/embed/avatars/4.png"
            },
            "fields": [
              {
                "name": "Suggestion:",
                "value": censoredecho
              }
            ]
          };
            SendMessage({ embed });
            log(message.author.username + " Suggested: " + censoredecho);
      }
    }
}
    
        
        
        
)
function BedWarsdata(deaths, killstreak, wins, name){
    const embed = {
        "title": "Player's hypixel API data:",
        "description": "This shows data pulled from the hypixel API about a player!",
        "color": 15801205,
        "timestamp": "2021-01-11T18:35:01.246Z",
        "footer": {
          "text": "Taobot"
        },
        "thumbnail": {},
        "image": {},
        "author": {
          "icon_url": "https://cdn.discordapp.com/embed/avatars/4.png"
        },
        "fields": [
          {
            "name": "Username:",
            "value": name
          },
          {
            "name": "Bedwars wins",
            "value": wins
          },
          {
            "name": "Deaths:",
            "value": deaths
          },
          {
            "name": "Final kills:",
            "value": killstreak
          }
        ]
      };
      if(name == "null"){
        SendMessage("Please link account or specify user")
      }
      else{
        SendMessage({ embed });
      } 

}
function SkyWarsdata(deaths, killstreak, played, wins, name){
    const embed = {
        "title": "Player's hypixel API data:",
        "description": "This shows data pulled from the hypixel API about a player!",
        "color": 15801205,
        "timestamp": "2021-01-11T18:35:01.246Z",
        "footer": {
          "text": "Taobot"
        },
        "thumbnail": {},
        "image": {},
        "author": {
          "icon_url": "https://cdn.discordapp.com/embed/avatars/4.png"
        },
        "fields": [
          {
            "name": "Username:",
            "value": name
          },
          {
            "name": "Skywars wins",
            "value": wins
          },
          {
            "name": "Games played:",
            "value": played
          },
          {
            "name": "Deaths:",
            "value": deaths
          },
          {
            "name": "Killstreak:",
            "value": killstreak
          }
        ]
      };
      if(name == "null"){
        SendMessage("Please link account or specify user")
      }
      else{
        SendMessage({ embed });
      } 
}
function Hypixeldata(exp, uuid, level, name, stats){
    const embed = {
        "title": "Player's hypixel API data:",
        "description": "This shows data pulled from the hypixel API about a player!",
        "color": 15801205,
        "timestamp": "2021-01-11T18:35:01.246Z",
        "footer": {
          "text": "Taobot"
        },
        "thumbnail": {},
        "image": {},
        "author": {
          "icon_url": "https://cdn.discordapp.com/embed/avatars/4.png"
        },
        "fields": [
          {
            "name": "Username:",
            "value": name
          },
          {
            "name": "Hypixel network level:",
            "value": level
          },
          {
            "name": "uuid:",
            "value": uuid
          },
          {
            "name": "exp:",
            "value": stats
          }
        ]
      };
      if(name == "null"){
        SendMessage("Please link account or specify user")
      }
      else{
        SendMessage({ embed });
      }
}
function DeleteMessages(message, NumMessages){
    console.log("Delete message called")
        if (NumMessages >= 100)
        {
            message.channel.send("Error! incorrect number of messages")
            .then(message =>{
                message.delete({ timeout: 3000 })
            })
        }
        else
        {
            message.channel.bulkDelete(NumMessages)
        }
}