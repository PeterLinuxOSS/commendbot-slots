const { Client, WebhookClient } = require('discord.js-selfbot-v13');
const client = new Client(); // All partials are loaded automatically
const config = require('./config.json');
client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  let channel = client.channels.cache.get("935238150475886692");
  const message = await channel.fetch("940231357475479563");
  client.setting.setCustomStatus({
    status: 'dnd', // 'online' | 'idle' | 'dnd' | 'invisible' | null
    text: `s${config.ID}`, // String | null
    emoji: null, // UnicodeEmoji | DiscordEmoji | null
    expires: null, // Date.now() + 1 * 3600 * 1000 <= 1h to ms
  });
  //button = await message.clickButton("commendbot")
  //new client.MessageButton(d)
  //console.log(button)
  //await channel.sendSlash("937729933571149847","balance")
  
})


const slot1 = config.slot1;
const slot2 = config.slot2;
const main1 = config.main1;
const main2 = config.main2;
const knowlist = ["Failed to find server."]
const webhookurl1 = config.webhookurl1
const webhookurl2 = config.webhookurl2


client.on('messageCreate', async (message) => {

    if (message.webhookId) return;
    if(message.author.id === client.user.id) return;

    
    if(message.channel.id === slot1){
        if (message.content.startsWith(`<@${client.user.id}>`)) {
        
            

            const webhook = new WebhookClient({ url: webhookurl1 });

        
            if (message.content){
                if (!knowlist.some(word => message.content.includes(word))){
                    console.log(message)
                
                    webhook.send({
                        content: message.content,
                        username: message.author.username,
                        avatarURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`,
                    
                    });
                }
                

            }
        }
        
             
        

        
    }else if(message.channel.id === main1){
        if (message.content) {
            let channel = client.channels.cache.get(slot1);
            channel.send(message.content);
            
        }
        
        
    }else if(message.channel.id === slot2){
        if (message.embeds) {
            

            const webhook_bot = new WebhookClient({ url: webhookurl2 });
            
            if  (message.content){
                webhook_bot.send({
                    content: message.content,
                    username: message.author.username,
                    avatarURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`,
                    embeds: message.embeds,
                
                });
            }else{
                webhook_bot.send({
                    username: message.author.username,
                    avatarURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`,
                    embeds: message.embeds,
                
                });
            }
            
        }

    }else if(message.channel.id === main2){
        if (message.content) {
            let channel = client.channels.cache.get(slot2);
            channel.send(message.content);
            
        }

    }

    
    
});

client.login(config.TOKEN);