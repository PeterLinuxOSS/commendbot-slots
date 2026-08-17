const { Client, WebhookClient } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false,}); // All partials are loaded automatically
const args = require('args-parser')(process.argv);

client.on('ready', async () => {
    let profile  = await client.user.getProfile()
    if (profile.phoneNumber) {
      console.log("true")
    }else{
      console.log("false")
    }
    if (profile.mfaEnabled){
      console.log("true")
    }else{
      console.log("false")
    }
    
    client.logout()
    
    
  
})


client.login(args.token);
