const mongoose = require('mongoose');

const manualsSchema = new mongoose.Schema({
    "brand" : {type : String},
    "category" : {type : String} ,
    "url" : {type : String},
    "title" : {type : String, unique : true},
    "parsingDate" : {type : String}
});

module.exports = mongoose.model("manuals", manualsSchema, "manuals");
