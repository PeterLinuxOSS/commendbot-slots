const { Client, WebhookClient } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');
class CustomClient extends Client {
    constructor(options) {
      super(options);
      this.slot_id = options.slot_id;
    }
  }


const config = require('./config.json');
const mongoose = require("mongoose");
const MongoDB = process.env.MONGODB_URI; // was a hardcoded credential
const schemaSomeNmae = require("./scheme");
require('mongoose-long')(mongoose);
var Long = mongoose.Types.Long;
mongoose.set('strictQuery', true)
mongoose.connect(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true,retryWrites:true,appName:"Cluster0"})

const sinx = process.env.UPSTREAM_BOT_USER_ID; // Discord user ID of the upstream commend bot
const db = mongoose.connection;
const collection = db.collection("slottrans");
const slotdbs = db.collection("commendbotstatus");
let started = []
let clients = []

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




db.on('error', function (err) {
    exec('pm2 restart 1', (error, stdout, stderr) => {
        if (error) {
            console.error('Error restarting PM2 process 1:', error);
        } else {
            console.log('PM2 process 1 restarted successfully.');
            // Optional: Log the standard output or standard error if needed
            if (stdout) {
            console.log(stdout);
            }
            if (stderr) {
            console.error(stderr);
            }
        }
        });
    

});

db.once('open', async function () {
    const databases = await schemaSomeNmae.find({sloton:true})
    for (key in databases){
        
        started.push(databases[key].userid);
        await loadbot(databases[key]);
        await sleep(2500);
        d = clients[clients.length - 1];
        if (d){
            if (d.slot_id === databases[key]._id){
                
                if (d.user.id === databases[key].userid){
                    
                }else{
                    console.log(`user id is incorrect changeing to ${d.user.id}`);
                    started.forEach((parameter, index) => {
                        if (parameter === databases[key].userid) {
                            started[index] = d.user.id;
                        }
                      });
                    
                    var id = Long.fromString(d.user.id);
                    await slotdbs.updateOne({_id:databases[key]._id},{"$set":{"userid": id}})
                    
                }
            }

        }else{
            console.log("error slot is not in list");
        }
        
    }

    setInterval(async function(){
            const databases = await schemaSomeNmae.find({sloton:true})
            if (clients.length !== 0){
                for (i in clients){
                    d = clients[i]
                    
                    if (d.user && databases.some(o => o.userid == d.user.id)) {
                        console.log("slot is running")
                    } else{
                        console.log("slot is off")
                        clients = clients.filter(item => item !== d)
                        started = started.filter(item => item !== d.user.id)
                        d.destroy()
                    }
        
        
                }
            }
            for (key in databases){
                dl = databases[key]
                
                if (!started.includes(dl.userid)){
                    console.log("started slot ")
                    started.push(dl.userid);
                    await loadbot(dl);
                    await sleep(2500);
                    d = clients[-1]
                    if (d){
                        if (d.slot_id === dl._id){
                            
                            if (d.user.id === dl.userid){
                                
                            }else{
                                console.log(`user id is incorrect changeing to ${d.user.id}`);
                                started.forEach((parameter, index) => {
                                    if (parameter === dl.userid) {
                                        started[index] = d.user.id;
                                    }
                                  });
                                
                                var id = Long.fromString(d.user.id);
                                await slotdbs.updateOne({_id:dl._id},{"$set":{"userid": id}})
                                
                            }
                        }
            
                    }else{
                        console.log("error slot is not in list");
                    }
                }
                    
               
     
            }
            
            
            

        
        
          }, 3 * 60000);
    

    
    const changeStream = collection.watch();
    
    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const doc = change.fullDocument
            send_values(doc);
            
    }});
          
    
    

    const results = await collection.find({ push: "post" }).sort({ '_id': -1 }).toArray();;

    

            for (let id in results) {
                let iterationCount = 0
                const result = results[id];
                const client = clients.find((client) => client.slot_id === result.slot_id);
                if (client){
                    while (!client.isReady() && iterationCount < 5) {
                        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
                    
                        iterationCount++;
                    }
                    if (client.isReady()){
                        send_values(result);
                        await sleep(500);
                    }else{
                        console.log("Client is not still ready, skipping.")
                    }

                }
                
                
            }

            
        });


function send_values(doc, client=null){
    
    if ("slot_id" in doc ){
                
        if (doc.push === "post"){
            
            if (!client){
                
                client = clients.find((client) => client.slot_id === doc.slot_id);
                
            }
            
            if (client == null){
                console.log(doc)
            }

            let channel = client.users.cache.get(sinx);
            if (doc.type === "start"){
                
                let  message = "~commend " + doc.steamID64 +" " + doc.amount
                console.log(message);
                channel.send(message);
                


            }else if (doc.type === "stop"){
                let  message = "~sessions kill " + doc.steamID64 
                console.log(message);
                channel.send(message);
            }else if (doc.type === "sessions"){
                channel.send("~sessions");
                console.log("sessions");
            }else if (doc.type === "info"){
                channel.send("~info");
                console.log("~info");
            }
            collection.deleteOne({_id:doc._id}) 
               
        }
        
    }
    
    }




async function loadbot(database){
    const client = new CustomClient({
        checkUpdate: false,
        slot_id: database._id,
    }); 
    
    clients.push(client)
    
    client.on('ready', async () => {
        
        console.log(`${client.user.username} is ready! for slot ${database._id}`);
        
    })
    
    const knowlist = ["An error occurred in chunk"]
    
    
    
    client.on('messageCreate', async (message) => {

        if (message.webhookId) return;
        if(message.author.id === client.user.id) return;

        
        
        
        if(message.channel.type === 'DM' && message.channel.recipient.id === sinx){
            
            
                

                
            
                if (message.content ){
                    if (!knowlist.some(word => message.content.includes(word))){
                        if (message.content.includes("Commending SteamID")){
                            const steamID64 =message.content.split(": ")[1]
                            collection.insertOne({slot_id:client.slot_id,type:"commend_started",steamID64:steamID64,push:"respond"})
                            console.log("commend_started")
                        }else if (message.content.includes("Commendbot done for")){
                            const matches = message.content.match(/(\d+)/g);
                            const steamID64 = matches[0];
                            const totalCommends = parseInt(matches[1]);
                            collection.insertOne({slot_id:client.slot_id,type:"commend_done",steamID64:steamID64,push:"respond",total_commends:totalCommends})
                            console.log("commend_done")
                        }else if (message.content.includes("commends pending for target")){
                            const matches = message.content.match(/#(\d+)\sfinished with\s(\d+\/\d+)\scommends\.\s(\d+)\scommends pending for target\s(\d+)/);
                            
                            const chunkNumber = parseInt(matches[1]);
                            const chunkstats = matches[2];
                            const pendingCommends = parseInt(matches[3]);
                            const steamID64 = matches[4];
                            collection.insertOne({slot_id:client.slot_id,type:"commend_process",steamID64:steamID64,push:"respond",chunk_id:chunkNumber,chunkstats:chunkstats,pending_commends:pendingCommends})
                            console.log("commend_process")
                        }else if (message.content.includes("Commend limit reached.")){
                            
                            const matches = message.content.match(/up to (\d+)/);
                            const commendLimit = matches ? Number(matches[1]) : 0;
                            collection.insertOne({slot_id:client.slot_id,type:"limit_reached",push:"respond",limit:commendLimit})


                        }else if (message.content.includes("Failed to find session")){
                            collection.insertOne({slot_id:client.slot_id,type:"failed_find_session",push:"respond",msg:message.content})


                        }else if (message.content.includes("Target is already being commended.")){
                            collection.insertOne({slot_id:client.slot_id,type:"target_is_commended",push:"respond",msg:message.content})



                        }else if (!knowlist.some(word => message.content.includes(word))){

                            collection.insertOne({slot_id:client.slot_id,type:"other",push:"respond",msg:message.content})
                        }
                        
                    
                        
                    };
                    

                } else{
                    if (message.embeds[0].fields.length != 0){
                        tittle = message.embeds[0].fields[0].name
                        if (tittle === "Discord"){
                            const daily_bal = message.embeds[0].fields[1].value.split(" / ")
                            const used = Number(daily_bal[0])
                            const max_bal = Number(daily_bal[1])
                            const match = message.embeds[0].fields[4].value.match(/\d+/);
                            const extractedNumber = match ? parseInt(match[0]) : null;
                            const date = new Date(extractedNumber * 1000);
                            collection.insertOne({slot_id:client.slot_id,type:"info",push:"respond",currency:used,update_currency:max_bal,expire:date})

                        }
                        
                    }else{
                        console.log()
                        const regex = /\[([\d\s]+)\s-\s(\d+)\/(\d+)\]\(https:\/\/steamcommunity\.com\/profiles\/([\d]+)\)/g;
                        const dictList = {};

                        let match;
                        while ((match = regex.exec(message.embeds[0].description)) !== null) {
                        const [, id, actualamount, amount, profileId] = match;
                        dictList[id] = {
                            actualamount: parseInt(actualamount),
                            amount: parseInt(amount),
                            
                        };
                        }
                        collection.insertOne({slot_id:client.slot_id,type:"sessions",push:"respond",accounts:dictList})

                    }
                    
                        
                    

                };
            
            

            
        }
            
    
        
    });
    
    client.login(database.token);
}
