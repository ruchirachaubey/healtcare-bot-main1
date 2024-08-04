const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY="AIzaSyAYUveBlQETwOfox-EQURRrDsJdcW3xuSE";
const inputInitHeight = chatInput.scrollHeight;



const createChatLi =(message,className)=>{
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML= chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;


}

const generateResponse =(incomingChatLi) =>{
    const API_URL=`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
      };
// Send POST request to API , get response
fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
    messageElement.textContent = data.candidates[0].content.parts[0].text;
}).catch((error) =>{
    messageElement.classList.add("error");
    messageElement.textContent="Oops! Something Went wrong. Please Try Again.";
    
}).finally(() =>chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () =>{
    userMessage =chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height=`${inputInitHeight}px`;

    //Append the User's input to chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(() => {
        // display " getting details " while waiting for response
        const incomingChatLi = createChatLi(". . . .","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);

    
}
chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;

});
chatInput.addEventListener("keydown",(e)=>{
    //If enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat

    if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800){
        e.preventDefault();
        handleChat();
    }

});
sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click", () => document.querySelector(".bot").classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.querySelector(".bot").classList.toggle("show-chatbot"));