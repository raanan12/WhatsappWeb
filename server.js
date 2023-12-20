const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/pages/imges')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });
// const upload1 = multer({ dest: 'uploads/' }).single('audio');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static('pages'))

db.connect('mongodb+srv://ranan97531:2524097531R@cluster0.rhkco4m.mongodb.net/whatsApp')
    .then(() => {
        console.log('db on');
    })



// Schemas

const users = db.Schema({
    numFon: String,
    userName: String,
    newMassge: Boolean
})

const chet = db.Schema({
    SenderNumber: String,
    receivingNumber: String,
    content: String,
    date: Date,
    dateShow:String,
    time:String,
    type: String,
    observed: Boolean,
    received:Boolean,
    send:Boolean,

})

// colections

const colectionUsers = db.model('user', users);

const colectionChet = db.model('chet', chet);

// colectionUsers.insertMany({ numFon: '+972586343576', userName: 'doron' ,newMassge:false})


// get

app.get('/chets', (req, res) => {
    res.sendFile(__dirname + '/pages/chets111.html')
})

// post

app.post('/signIn', async (req, res) => {
    let number = req.body.number;
    let check = await colectionUsers.findOne({ numFon: number })
    if (check != null) {
        res.json(true)
    }
    else {
        res.json(false)
    }
})


// send messeg
app.post('/Send', (req, res) => {
    var date1 = new Date();
    var day = date1.getDate();
    var month = date1.getMonth() + 1;
    var year = date1.getFullYear();
    let date2 = day + '/' + month + '/' + year
    var hours = date1.getHours();
    var minutes = date1.getMinutes();
    let timeAll = hours + ':' + minutes
    let temp = {
        SenderNumber: req.body.SenderNumber,
        receivingNumber: req.body.receivingNumber,
        content: req.body.content,
        date: date1,
        dateShow:date2,
        time:timeAll,
        type: req.body.type,
        observed: false,
        received:false,
        send:true,
    }

    const send = async () => {
        await colectionUsers.updateOne({ numFon: temp.receivingNumber }, { $set: { newMassge: true } })
        await colectionChet.insertMany(temp)
        res.json(true)
    }
    send()

})


app.post('/shwo', (req, res) => {
    let numUser = req.body.userCunect
    const shwo = async () => {
        let arr = await colectionChet.find({
            $or: [
                { SenderNumber: numUser },
                { receivingNumber: numUser }
            ]
        })
        await colectionChet.updateMany({ receivingNumber: numUser },{$set:{received:true}})
        arr.sort((a, b) => b.date - a.date)
        arr = arr.filter((val, index, arr2) => {
            return arr2.findIndex((o) => {
                if (o.SenderNumber != numUser) {
                    return o.SenderNumber == val.SenderNumber || o.SenderNumber == val.receivingNumber
                }
                else {
                    return o.receivingNumber == val.receivingNumber || o.receivingNumber == val.SenderNumber
                }
            }) == index
        })
        res.setHeader('Content-Type', 'image/jpeg');
        res.json(arr)
    }
    shwo()
})

app.post('/chatToUser', (req, res) => {
    let temp = {
        userConect: req.body.userCunect,
        usrerSend: req.body.numFon
    }
    const shwoChets = async () => {
        let arrSend = await colectionChet.find({
            $or: [
                { SenderNumber: temp.userConect, receivingNumber: temp.usrerSend},
                { SenderNumber: temp.usrerSend, receivingNumber: temp.userConect}
            ]
        
        })
        await colectionChet.updateMany({
            $or: [
                { SenderNumber: temp.usrerSend, receivingNumber: temp.userConect }
            ]
        }, { $set: { observed: true } })
        arrSend.sort((a, b) => b.date - a.date)
        res.json(arrSend)
    }
    shwoChets()
})

app.post('/appendMasseg', (req, res) => {
    let temp = {
        userConect: req.body.userCunect,
        usrerSend: req.body.numFon
    }
    const shwoChets = async () => {
        let user = await colectionUsers.findOne({ numFon: temp.userConect })
        if (user.newMassge == true) {
            let arrSend = await colectionChet.find({
                $or: [
                    { SenderNumber: temp.userConect, receivingNumber: temp.usrerSend },
                    { SenderNumber: temp.usrerSend, receivingNumber: temp.userConect }
                ],
                
            })
            await colectionChet.updateMany({
                $or: [
                    { SenderNumber: temp.userConect, receivingNumber: temp.usrerSend },
                ]
            }, { $set: { observed: true } })
            arrSend.sort((a, b) => b.date - a.date)
            await colectionUsers.updateOne({ numFon: temp.userConect }, { $set: { newMassge: false } })
            res.json(arrSend)
        }

    }

    shwoChets()
})


app.post('/upload', upload.single('file'), (req, res, next) => {
    const downloadLink = `/imges/${req.file.filename}`;

    // שליחת הקישור בתשובה לצ'אט
    res.send({ result: downloadLink });
});

app.post('/uploadAudio', upload.single('audio'), (req, res, next) => {
    const downloadLink = `/imges/${req.file.filename}`
    console.log(downloadLink);

    // שליחת הקישור בתשובה לצ'אט
    res.send({ result: downloadLink });
})





app.listen(3000, () => {
    console.log('port 3000 is on');
})