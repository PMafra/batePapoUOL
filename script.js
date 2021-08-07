const SERVER_URL_NAMES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants"
const SERVER_URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status"
const SERVER_URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"

let userName = "";

function renderPage () {
    let promiseMessages = axios.get(SERVER_URL_MESSAGES);
    promiseMessages.then(processMessagesSucess);
    promiseMessages.catch(handleMessagesError);
}

function processMessagesSucess (sucess) {

    let allMessages = document.querySelector("main");
    for (let i = 0; i < sucess.data.length; i++) {
        
        if (sucess.data[i].type === "status"){
            allMessages.innerHTML += `<div class="message-box status"><time>(${sucess.data[i].time})</time><strong class="font-weight-700">${sucess.data[i].from}</strong><p>${sucess.data[i].text}</p></div>`;
            allMessages.lastElementChild.scrollIntoView();
            if (sucess.data[i].text === "entra na sala...") {
                let addContact = document.querySelector(".side-bar .contacts");
                let checkPerson = document.getElementById(`${sucess.data[i].from}`);
                if (checkPerson === null) {
                    addContact.innerHTML += 
                    `<div class="option" onclick="select(this)">
                        <ion-icon name="person-circle"></ion-icon>
                        <span class="option-name">
                            <p id="${sucess.data[i].from}">${sucess.data[i].from}</p>
                            <ion-icon name="checkmark" class="check"></ion-icon>           
                        </span>
                    </div>`;
                }
            }
            if (sucess.data[i].text === "sai da sala...") {
                let removeContact = document.getElementById(`${sucess.data[i].from}`);
                if (removeContact !== null) {
                    removeContact.parentElement.parentElement.outerHTML = "";
                }
            }
        }
        if (sucess.data[i].type === "message"){
            allMessages.innerHTML += `<div class="message-box normal-message"><time>(${sucess.data[i].time})</time><strong class="font-weight-700">${sucess.data[i].from}</strong><p> para </p><strong class="font-weight-700">${sucess.data[i].to}:</strong><p>${sucess.data[i].text}</p></div>`;
            allMessages.lastElementChild.scrollIntoView();
        }
        if (sucess.data[i].type === "private_message"){
            if (sucess.data[i].to === userName) {
                allMessages.innerHTML += `<div class="message-box private-message"><time>(${sucess.data[i].time})</time><strong class="font-weight-700">${sucess.data[i].from}</strong><p> reservadamente para </p><strong class="font-weight-700">${sucess.data[i].to}:</strong><p>${sucess.data[i].text}</p></div>`;
                allMessages.lastElementChild.scrollIntoView();
            }
            
        }
    }
}

function handleMessagesError (error) {
    console.log(error.response.status);
}

renderPage()
//const rendering = setInterval(renderPage, 3000);

function askUserName () {
    while (userName === "") {
        userName = prompt("Qual o seu lindo nome?");
    }

    let userNameData = {name: userName};
    checkUserName(userNameData);

    return userName;
}

askUserName();
console.log(userName);

function checkUserName (data) {
    
    let requestName = axios.post(SERVER_URL_NAMES, data);
    requestName.then(processNameSucess);
    requestName.catch(handleNameError);
}

function processNameSucess () {
    alert("Seu nome foi cadastrado!");
    //const status = setInterval(userStatus, 5000);
    return status;
}

function handleNameError (error) {
    if (error.response.status === 400){
        alert("Já existe um usuário com esse nome!");
    } else {
        alert("Deu ruim mas não sei porque!");
    }
    askUserName();
}

function userStatus () {

    let requestStatus = axios.post(SERVER_URL_STATUS, {name: userName});
    requestStatus.then(stillConected);
    requestStatus.catch(leftRoom);
}

function stillConected () {
    console.log("você se mantem conectado");
}

function leftRoom () {
    alert("Você deixou a sala");
    clearInterval(rendering);
    clearInterval(status);
    refreshPage();
}

function refreshPage () {
    location.reload();
}

function sendMessage () {

    let from = userName;
    let to = document.querySelector(".all").innerHTML;
    let text = document.querySelector(".writing").value;
    
    let objectMessage = {from, to, text, type: "message"};
    let requestMessage = axios.post(SERVER_URL_MESSAGES, objectMessage);
    requestMessage.then(renderPage);
    requestMessage.catch(refreshPage);

    //document.querySelector("main").innerHTML += `<div>${text}</div>`
    //document.querySelector("main").lastElementChild.scrollIntoView();
    //let inputField = document.querySelector(".bottom-bar");
    //inputField.firstElementChild.innerHTML = '<input class="writing" type="text" placeholder="Escreva aqui...">'
}

function sideBar () {
    const sideBar = document.querySelector(".side-bar");
    sideBar.classList.toggle("hidden");
    const blurredBackground = document.querySelector(".blurred-background");
    blurredBackground.classList.toggle("hidden");
}

let checked;
function select (element) {
    if (element.parentElement.classList.contains("visibilities")){
        checked = document.querySelector(".visibilities .visible");
    };
    if (element.parentElement.classList.contains("contacts")){
        checked = document.querySelector(".contacts .visible");
    };

    if (checked !== null) {
        checked.classList.toggle("visible");
    }
    element.lastElementChild.lastElementChild.classList.toggle("visible");
}







