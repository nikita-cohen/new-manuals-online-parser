const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

mongoose.connect('mongodb://localhost:27017/findManual-complete').then()
    .catch(e => {
        console.log(e)
    })
