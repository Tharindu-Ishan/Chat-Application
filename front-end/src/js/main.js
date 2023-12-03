import { GoogleAuthProvider,signOut ,onAuthStateChanged,signInWithPopup} from "firebase/auth";
import { auth } from "../firebase.js";

const provider = new GoogleAuthProvider();
const txtMessageElm=document.querySelector('#txt-message');
const btnSendElm=document.querySelector('#btn-send');
const btnSignInElm=document.querySelector('#btn-sign-in');
const outputElm=document.querySelector('#output');
const loginOverlayElm=document.querySelector('#login-overlay');
const accountElm=document.querySelector('#account');
const userNameElm=document.querySelector('#user-name');
const userEmailElm=document.querySelector('#user-email');
const btnSignOutElm=document.querySelector('#btn-sign-out');
const loaderElm=document.querySelector('#loader');

const {API_BASE_URL}=process.env;
const user={
    email:null,
    name:null,
    picture:null
};
let ws =null;


accountElm.addEventListener('click',(e)=>{
    accountElm.querySelector('#account-details').classList.remove('d-none');
    e.stopPropagation();
});

document.addEventListener('click',(e)=>{
    
    accountElm.querySelector('#account-details').classList.add('d-none');
    e.stopPropagation();
});
btnSignOutElm.addEventListener('click',(e)=>{
    accountElm.querySelector('#account-details').classList.add('d-none');
    e.stopPropagation();
    signOut(auth);
})

onAuthStateChanged(auth,(loggedUser)=>{
    loaderElm.classList.add('d-none');
    if(loggedUser){
        user.email=loggedUser.email;
        user.name=loggedUser.displayName;
        user.picture=loggedUser.photoURL;
        finalizeLogin();
        loginOverlayElm.classList.add('d-none');
        if(!ws){
            ws=new WebSocket(`ws://localhost:8080/api/v1/messages`);
            ws.addEventListener('message',loadNewChatMessage);
            ws.addEventListener('error',()=>{
                alert("Connection failure, try refreshing the application");
            });
        }
    }else{
        user.email=null;
        user.name=null;
        user.picture=null;
        loginOverlayElm.classList.remove('d-none');
        if(ws){
            ws.close();
            ws=null;
        }
    }
});
function finalizeLogin(){
    userNameElm.innerText=user.name;
    userEmailElm.innerText=user.email;
    accountElm.style.backgroundImage=`url(${user.picture})`;
}
btnSignInElm.addEventListener('click',()=>{
    signInWithPopup(auth,provider)
    .then((res)=>{
        user.name=res.user.displayName;
        user.email=res.user.email;
        user.picture=res.user.photoURL;
        loginOverlayElm.classList.add('d-none');
        finalizeLogin();
    }).catch((err)=> alert("failed to sign in"))
});

btnSendElm.addEventListener('click',()=>{
    const message=txtMessageElm.value.trim();
    if(!message) return;
    
    const msgObj={
        message:message,
        email:user.email
    };

    ws.send(JSON.stringify(msgObj));
    addChatMessageRecord(msgObj);
    outputElm.scrollTo(0,outputElm.scrollHeight);
    txtMessageElm.value='';
    txtMessageElm.focus();

});

function addChatMessageRecord({message,email}){
    const messageElm=document.createElement('div');
    messageElm.classList.add('message');
    if(email===user.email){
       messageElm.classList.add('me');
    }else{
        messageElm.classList.add('others');
    }
    outputElm.append(messageElm);
    messageElm.innerHTML=message;

}

function loadNewChatMessage(e){
    const msg= JSON.parse(e.data);
    addChatMessageRecord(msg);
    
}











