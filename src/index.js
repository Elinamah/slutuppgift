const baseUrl = 'https://ha-slutuppgift-chat-do.westling.workers.dev';
const bearer = 'Bearer N31fRWVMZCtwU0JeZnBQdVBjTmlOImRzcTAxfl08cz1xR2lyWGFJfmo5JC5RNSc=';
const username = 'Elina';

let limit = '';

let timeStamp;
let User;
let Message;

addEventListener('pageshow', init);
setInterval(update, 3000);
addEventListener('submit', addMessages);

async function init(){
   const request = await fetch(`${baseUrl}/api/messages${limit}`,{
    method: 'GET',
    headers: {
        'Authorization': bearer,
        'Content-type': ''
    },
   }).then((response) => response.json()).then((data) => {
        return data
   });

   request.messages.sort((a,b) => a.timestamp - b.timestamp);

   const chatMessages = document.getElementById("chatMessages");
   localStorage.setItem('last', request.last);
   const documentFragment = new DocumentFragment();

   for (let i = 0; i < request.messages.length; i++){
        let chatBox = document.createElement("article");
        let chatMessage = document.createElement("p");

        timeStamp = request.messages[i].timestamp;
        User = request.messages[i].user+":";
        Message = request.messages[i].message;
        chatMessage.innerHTML = Intl.DateTimeFormat('sv-FI', {dateStyle: 'short', timeStyle: 'short'}).format(timeStamp)
                            +`<br> ${User} ${Message} <br>`;

        if (request.messages[i].user !== username) {
            chatBox.classList.add('otherMessages', 'message');
        }
        else {
            chatBox.classList.add('myMessages', 'message');
        }

        chatBox.appendChild(chatMessage);
        documentFragment.appendChild(chatBox);
   }

   chatMessages.appendChild(documentFragment);
}

async function update(){
    const request = await fetch(`${baseUrl}/api/messages/updated`, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-type': ''
        },
        body: JSON.stringify({last:Number(localStorage.getItem('last'))})
    });
    const response = await request.json();

    if (!response.updated){
        limit = '?limit=1';
        await init();
    }

}

async function addMessages(event) {
    event.preventDefault();

    const newMessage = document.getElementById('textMessage').value;
    await fetch(`${baseUrl}/api/messages/append`, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-type': ''
        },
        body: JSON.stringify({message:newMessage, user:username})
    });
    document.getElementById('textMessage').value = '';
}




