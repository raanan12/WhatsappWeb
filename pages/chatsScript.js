let ret = ''
let fileShow = ''
let aud = ''
let sendper = ''

let userCunect = localStorage.getItem('userConect')
let uesrSend = ''


let mediaRecorder;
let recordedChunks = [];
let num = 0;
let timer = ''
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');

const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.addEventListener('dataavailable', event => {
                recordedChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(recordedChunks);
                const audioURL = URL.createObjectURL(audioBlob);

                const formData = new FormData();
                let fileName = generateUUID()
                fileName += '.mp3'
                formData.append('audio', audioBlob, fileName);

                fetch('/uploadAudio', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then((data) => {
                        aud = data.result
                        console.log(aud);
                    })
                    .catch(error => {
                        console.error('שגיאה בשליחת הבקשה:', error);
                    });
                recordedChunks = [];
            });
            mediaRecorder.start();
        })
        .catch(error => {
            console.log('Error accessing microphone:', error);
        });
}

const start1 = () => {
    startRecording()
    document.getElementById('red').style.display = 'block'
    let stop = false
    let t1mie1 = () => {
        if (!stop) {
            num++
            document.getElementById('time').innerHTML = num
        }

    }
    timer = setInterval(t1mie1, 1000)
}
const stopRecording = () => {
    document.getElementById('red').style.display = 'none'
    mediaRecorder.stop();
    mediaRecorder = null;
    clearInterval(timer)
    num = 0
    document.getElementById('time').innerHTML = num
    setTimeout(() => {
        sendAudio()
    }, 1000)
}

stopButton.addEventListener('click', stopRecording);

console.log(userCunect);
let inputFile = document.getElementById('file')


inputFile.addEventListener('change', function () {

    saveFile()
    const file = this.files[0];
    let img = document.getElementById('hwoe')
    let div = document.getElementById('showFile')
    // יצירת אובייקט FileReader לקריאת התמונה
    const reader = new FileReader();

    reader.onload = function (e) {
        // הצגת התמונה באלמנט img
        img.src = e.target.result;

        div.style.display = 'block'

    };

    // קריאת התמונה כטקסט באמצעות ה-methosd readAsDataURL
    reader.readAsDataURL(file);
});




// 



const NewDivChet = (content, data, side,stutus) => {
    let div = document.createElement('div');
    let p = document.createElement('p');
    let p1 = document.createElement('img');
    p1.style.margin = '0px';
    p1.style.padding = '0px';
    p1.style.width = '15px';
    p1.style.height = '15px';
    p1.style.display = 'block';
    p.innerHTML = content
    if(side == 'send'){
        if(stutus == 'observed'){
            p1.src = 'l22.png' 
        }
        else if(stutus == 'received'){
            p1.src = 'll.png'
        }
        else{
            p1.src = 'l1.png'
        }
        p.append(p1)
    }
    if (content.length > 35) {
        content = content.replace(/(.{45})/g, "$1<br>");
    }
    p.setAttribute('class', side)
    div.append(p);
    document.getElementById('content').append(div)
    sendper = side
}

const NewDivChetFile = (content, data, side) => {
    let div = document.createElement('div');
    let a = document.createElement('a');
    let img = document.createElement('img');
    let br = document.createElement('br');
    div.style.width = '350px'
    let whiteD = parseInt(div.style.width) + 40
    console.log(content);
    a.setAttribute('href', content);
    a.setAttribute('download', content)
    a.innerHTML = 'הורדה'
    img.src = content
    div.setAttribute('class', side)
    if (side == 'getting') {
        div.style.left = `calc(100% - ${whiteD}px)`
    }
    div.append(img, br, a);
    document.getElementById('content').append(div)
}

const NewDivChetAudio = (content, data, side) => {
    if (content.length != 0) {
        let div = document.createElement('div');
        let audio = document.createElement('audio');
        let source = document.createElement('source');
        let img = document.createElement('img');
        img.style.height = '50px'
        img.style.width = '50px'
        img.src = 'conect2.png'
        div.style.width = '300px'
        div.style.height = '40px'
        audio.style.margin = '0px'
        audio.style.padding = '0px'
        audio.style.height = '30px'
        audio.controls = 'controls'
        source.src = content;
        audio.append(source)
        div.setAttribute('class', side)
        div.setAttribute('id', 'audi')
        div.append(img, audio);
        let whiteD = parseInt(div.style.width) + 40
        if (side == 'getting') {
            div.style.left = `calc(100% - ${whiteD}px)`
        }
        document.getElementById('content').append(div)
    }

}

const shwoChatOne = (numFon) => {
    fetch('/chatToUser', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
            userCunect,
            numFon
        })
    })
        .then(res => res.json())
        .then((data) => {
            document.getElementById('content').innerHTML = ''
            data.forEach((val) => {
                let stutus = 'send'
                if(val.observed == true){
                    stutus = 'observed'
                }
                else if(val.received == true){
                    stutus = 'received'
                }
                if (val.SenderNumber == userCunect) {
                    if (val.type == 'text') {
                        console.log(val.type);
                        NewDivChet(val.content, val.data, 'send',stutus)
                    }
                    else if (val.type == 'img') {
                        NewDivChetFile(val.content, val.data, 'send',stutus)
                    }
                    else if (val.type == 'audio') {
                        NewDivChetAudio(val.content, val.data, 'send',stutus)
                    }

                }
                else {
                    if (val.type == 'text') {
                        NewDivChet(val.content, val.data, 'getting',stutus)
                    }
                    else if (val.type == 'img') {
                        NewDivChetFile(val.content, val.data, 'getting',stutus)
                    }
                    else if (val.type == 'audio') {
                        NewDivChetAudio(val.content, val.data, 'getting',stutus)
                    }
                }
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

const appendMasseg = (numFon) => {
    console.log('ppp');
    fetch('/appendMasseg', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
            userCunect,
            numFon
        })
    })
        .then(res => res.json())
        .then((data) => {
            console.log('ooo');
            console.log(data);
            document.getElementById('content').innerHTML = ''
            data.forEach((val) => {
                let stutus = 'send'
                if(val.observed == true){
                    stutus = 'observed'
                }
                else if(val.received == true){
                    stutus = 'received'
                }
                if (val.SenderNumber == userCunect) {
                    if (val.type == 'text') {
                        console.log(val.type);
                        NewDivChet(val.content, val.data, 'send',stutus)
                    }
                    else if (val.type == 'img') {
                        NewDivChetFile(val.content, val.data, 'send',stutus)
                    }
                    else if (val.type == 'audio') {
                        NewDivChetAudio(val.content, val.data, 'send',stutus)
                    }

                }
                else {
                    if (val.type == 'text') {
                        NewDivChet(val.content, val.data, 'getting',stutus)
                    }
                    else if (val.type == 'img') {
                        NewDivChetFile(val.content, val.data, 'getting',stutus)
                    }
                    else if (val.type == 'audio') {
                        NewDivChetAudio(val.content, val.data, 'getting',stutus)
                    }
                }
            }
            )
        })
        .catch((err) => {
            console.log(err);
        })

}


const newDiv = (numFon, date, send,) => {
    let div = document.createElement('div')
    let div2 = document.createElement('div')
    let img = document.createElement('img')
    let p = document.createElement('p')
    let p1 = document.createElement('p')
    let p2 = document.createElement('p')
    p2.innerHTML = date
    p2.style.fontSize = '13px'
    img.src = 'conect2.png'
    div.setAttribute('class', 'listChats')
    div.addEventListener('click', () => {
        document.getElementById('sundUser').innerHTML = numFon
        uesrSend = numFon
        shwoChatOne(numFon)
    })
    p.innerHTML = numFon;
    if (send.length > 10) {
        send = '...' + send.slice(0, 10)
    }
    p1.innerHTML = send
    div2.append(p, p1)
    div.append(p2, div2, img)
    document.getElementById('chatsUser').append(div)
}

const shwo = () => {
    fetch('/shwo', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
            userCunect

        })
    })

        .then(res => res.json())
        .then((data) => {
            let showTime = ''
            var date1 = new Date();
            var day = date1.getDate();
            var month = date1.getMonth() + 1;
            var year = date1.getFullYear();
            let date2 = day + '/' + month + '/' + year;
            console.log(userCunect);
            document.getElementById('chatsUser').innerHTML = ''
            data.forEach((val) => {
                if (date2 === val.dateShow) {
                    showTime = val.time
                }
                else {
                    showTime = val.dateShow
                }
                if (val.SenderNumber == userCunect) {
                    if (val.type == 'img') {
                        newDiv(val.receivingNumber, showTime, 'img')
                    }
                    else if (val.type == 'audio') {
                        newDiv(val.receivingNumber, showTime, 'הודעה קולית')
                    }
                    else { newDiv(val.receivingNumber, showTime, val.content) }
                }
                else {
                    if (val.type == 'img') {
                        newDiv(val.SenderNumber, showTime, 'img')
                    }
                    else if (val.type == 'audio') {
                        newDiv(val.SenderNumber, showTime, 'הודעה קולית')
                    }
                    else {
                        newDiv(val.SenderNumber, showTime, val.content)
                    }
                }
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

shwo()
const newChet = () => {
    let num = document.getElementById('newChet').value;
    document.getElementById('sundUser').innerHTML = num;
    uesrSend = num
    fetch('/shwoChat', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
            userCunect
        })
    })

}

const send = () => {
    let content = document.getElementById('contentSend').value;
    if (uesrSend.length == 13) {
        fetch('/Send', {
            headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({
                SenderNumber: userCunect,
                receivingNumber: uesrSend,
                content: content,
                type: 'text',
                observed: false
            })
        })
            .then(res => res.json())
            .then((data) => {
                document.getElementById('chatsUser').innerHTML = 'מרענן'
                document.getElementById('contentSend').innerHTML = 'Type a message here'
                document.getElementById('chatsUser').innerHTML = ''
                shwo()
                shwoChatOne(uesrSend)
            })
            .catch((err) => {
                console.log(err);
            })

    }
    document.getElementById('contentSend').value = ''

}

const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
        send();
    }
}

const addChat = (event) => {
    if (event.keyCode === 13) {
        let numdd = '+972' + document.getElementById('fon').value
        document.getElementById('sundUser').innerHTML = numdd
        document.getElementById('sundUser').value = numdd
        uesrSend = numdd
        shwoChatOne(numdd)
    }
}

const saveFile = () => {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    let div = document.getElementById('showFile');
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            console.log(data.result);
            ret = data.result
            console.log(ret);
        })
        .catch(err => {
            console.error(err);
        });
}

const sendFile = () => {
    let content = ret
    if (uesrSend.length == 13) {
        fetch('/Send', {
            headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({
                SenderNumber: userCunect,
                receivingNumber: uesrSend,
                content: content,
                type: 'img',
                observed: false
            })
        })
            .then(res => res.json())
            .then((data) => {
                document.getElementById('chatsUser').innerHTML = 'מרענן'
                document.getElementById('contentSend').innerHTML = 'Type a message here'
                shwoChatOne(uesrSend)
                document.getElementById('chatsUser').innerHTML = ''
                shwo()
            })
            .catch((err) => {
                console.log(err);
            })

    }
    document.getElementById('showFile').style.display = 'none'
}

const sedff = () => {
    setTimeout(() => {
        sendFile()
    }, 1000)
}
const sendAudio = () => {
    let content = aud
    console.log(content);
    if (uesrSend.length == 13) {
        fetch('/Send', {
            headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({
                SenderNumber: userCunect,
                receivingNumber: uesrSend,
                content: content,
                type: 'audio',
                observed: false
            })
        })
            .then(res => res.json())
            .then((data) => {
                document.getElementById('chatsUser').innerHTML = 'מרענן'
                document.getElementById('contentSend').innerHTML = 'Type a message here'
                shwoChatOne(uesrSend)
                document.getElementById('chatsUser').innerHTML = ''
                shwo()
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

const fileNotShow = () => {
    document.getElementById('showFile').style.display = 'none'
}

// עידכון הדפדן
const pollingInterval = 5000
const pollForNewData = () => {
    appendMasseg(uesrSend)
    shwo()
}
setInterval(pollForNewData, pollingInterval);







