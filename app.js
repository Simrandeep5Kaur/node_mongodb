const express = require("express");
var multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const imgModel = require('./model/model');

var app = express()
mongoose.connect('mongodb://localhost/imageUpload1', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

var myDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({
    storage: myDiskStorage,
    limits: {
        fieldSize: 1024 * 1024 * 3//3mb
    }
})

app.get('/', function (req, res) {
    imgModel.find({}, function (err, items) {
        if (err) {
            console.error(err);
        } else {
            res.render('index', { items: items });
        }
    })
})

app.post('/', upload.single('image'), async function (req, res) {
    var obj = new imgModel({
        name: req.body.name,
        img: {
            data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
            contentType: 'image/*'
        }
    })
    await obj.save();
    console.log(obj.img.data);
    res.redirect('/');
})

app.listen(5002, console.log('running on port 5002'));

