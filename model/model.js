const mongoose = require('mongoose');

var imgSchema = new mongoose.Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String
    }
})

module.exports = new mongoose.model('Image', imgSchema);