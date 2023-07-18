const socket = io('http://localhost:8000');                 //connection to web server

const form =document.getElementById('send-container');
const messageInput= document.getElementById('messageinput');
const messageContainer=document.querySelector('.container');
let audio=new Audio('notif.mp3');


// function which show new message in container
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

// when user submit new message it send to the server and server sends it to other joined user
form.addEventListener('submit',(e)=>{
    e.preventDefault();            //use to stop refreshing the page 
    const message =messageInput.value;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageInput.value="";
})



const name = prompt('Enter your name to join');         //ask user name and let the server know
socket.emit('new-user-joined', name);                   


socket.on('user-joined',name =>{                    //if a new user joins, server know the other user new_user join 
    append(`${name} joined the chat `,'right');
})

socket.on('receive',data =>{                              //server send the message to the other user      
    append(`${data.name}: ${data.message} `,'left');
})

socket.on('left',name =>{                           //invoke when anyone is leave the server
    append(`${name}: left the chat `,'left');
})