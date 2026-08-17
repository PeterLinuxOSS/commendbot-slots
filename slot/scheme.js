// Require Mongoose
const { model, Schema } = require('mongoose');

// Define a schema


const SomeModelSchema = new Schema({
    _id:Number,
    token : String,
    commend_channelid : String,
    webhook : String,
    enable : Boolean,
    userid : String,
    currency : Number,
    sloton : Boolean
});

/*const exportdata = new Schema({
    steamID64 : String,
    amount : Number,
    chunk : Number,
    getcommends : Number,
    targetpending: Number,
    totalcommends : Number,
    getchunk_now : Number,
    getchunk_max : Number,
    type : String["pending","done","started"],

    
}); 
module.exports = model('exportdata', exportdata, "exportdata");*/
module.exports = model('commendbotstatus', SomeModelSchema, "commendbotstatus");