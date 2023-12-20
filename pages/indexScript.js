const  ifInNumber=(str)=> {
    return /^\d+$/.test(str);
  }


//   check if the number fon is valid
const isValidFon = ()=>{
    let number = document.getElementById('fon').value;
    let p = document.getElementById('error')
    // p.innerHTML = 'number fon is no valid'
    if(ifInNumber(number)==false){
        document.getElementById('signIn').disabled = true
        p.innerHTML = 'number fon is no valid'
    }
    else if(number.length != 9){
        document.getElementById('signIn').disabled = true
        p.innerHTML = 'number fon is no valid'
    }
    else{
        document.getElementById('signIn').disabled = false
        p.innerHTML = ''
    }
}

const signIn = () =>{
    let number = '+972'+document.getElementById('fon').value;
    fetch('/signIn',{
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
          number
        })
      })
    .then(res=>res.json())
    .then((data)=>{
        if(data === true){
            localStorage.setItem('userConect',number);
            location.href = '/chets'
        }
    })
    .catch((err)=>{
        console.log(err);
    })
}

