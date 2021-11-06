//Language. Availables options: es,en
let lang="es";
//Discord Library
const Discord = require('discord.js');
//File System Library
const fs = require('fs');

//File with the chosen language
const langFile = "lang."+lang+".json";
let rawdata = fs.readFileSync(langFile);
let msg = JSON.parse(rawdata);
//File with bot configuration
const conf = "Conf.json";
rawdata = fs.readFileSync(conf);
let config = JSON.parse(rawdata);
//Constants generated from config.json
const TOKEN = config.botToken
const CHANNELID=config.channelID
const LINK1=config.link1
const LINK2_1=config.link2_1
const LINK2_2=config.link2_2
//Constants generated from msg.json
const FIRST_HEADER=msg.firstHeader
const SECOND_HEADER=msg.secondHeader
const CLIENT_ON=msg.ClientOn
const CLIENT_OFF=msg.ClientOff

//Articles that don't need to be capitalized
const ARTICLES=["the","of"]

//Client
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(TOKEN)

//Analyzes all messages
client.on('messageCreate', message =>
{
    //Checks if the message is on the correct channel
    if(message.channelId==CHANNELID)
    {
        //Switch based on message type
        switch (typeOfMessage(message))
        {
            //Searchs on the wiki
            case "search":
                const args = message.content.split(/ +/)
                let result="";
                let link1=LINK1;
                for (let index = 0; index < args.length; index++)
                {
                    if(!ARTICLES.includes(args[index]))
                    {
                        link1 += capitalizeFirstLetter(args[index]);
                        link1 += "_"
                    }
                    else
                    {
                        link1 += args[index];
                        link1 += "_"
                    }
                }
                link1=link1.slice(0,-1)
                result+=FIRST_HEADER+link1
                let link2=LINK2_1;
                for (let index = 0; index < args.length; index++)
                {
                    link2 += capitalizeFirstLetter(args[index]);
                    link2 += "_"
                }
                link2=link2.slice(0,-1)
                link2+=LINK2_2
                result+=SECOND_HEADER+link2
                client.channels.cache.get(CHANNELID).send(result)
                break;
            //Poweroffs the bot
            case "command":
                switch (message.content.toUpperCase()) {
                    case "!POWEROFF":
                    client.channels.cache.get(CHANNELID).send(CLIENT_OFF).then(()=>
                    {
                      client.destroy()
                    })
                    break;
                  default:
                  break;
                }
                break;
            //If the message, is sent by itself or it's a link, it does nothing
            default:
                break;
        }
    }
})
//Message sent when the bot is online
client.once('ready', () =>
{
    client.channels.cache.get(CHANNELID).send(CLIENT_ON).then(()=>
    {
        client.user.setActivity("Minecraft 2D",
        {
            type: "PLAYING"
        });
    });
})
// ---Functions---
// Function that capitalize a string
//     @param string    string to be capitalized
//     @return string   capitalized string
function capitalizeFirstLetter(string) {
    string=string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
// Function that analyze a message
//     @param inMessage     message to be analyzed
//     @return result       analysis result
function typeOfMessage(inMessage)
{
    let result=""
    if(inMessage.author.bot)
    {
        result="bot"
    }
    else if(inMessage.content.toUpperCase().startsWith("HTTP"))
    {
        result="link"
    }
    else if(inMessage.content.startsWith("!"))
    {
        result="command"
    }
    else
    {
        result="search"
    }
   return result
}
