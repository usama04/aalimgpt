import { React, useState } from 'react';
import ChatMessage from './ChatMessage';
import { Logout } from './Logout';

const Chat = () => {

    // add state for input and chat log
    const [input, setInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [fullChatLog, setFullChatLog] = useState([]);

    function clearChat() {
        setChatLog([]);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const newMessage = { user: 'questioner', message: input };
        const chatLogNew = [...chatLog, newMessage];
        const fullChatLogNew = [...fullChatLog, newMessage];
    
        await setInput('');
        setChatLog(chatLogNew);
        setFullChatLog(fullChatLogNew);
    
        const messages = fullChatLogNew.map((message) => ({
          role: message.user,
          message: message.message,
        }));
    
        const response = await fetch('http://localhost:8080/api/mufti', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('usertoken'),
          },
          body: JSON.stringify({
            messages: messages,
          }),
        });
    
        const data = await response.json();
        const newAssistantMessage = { user: data.user, message: data.message };
        setChatLog([...chatLogNew, newAssistantMessage]);
        setFullChatLog([...fullChatLogNew, newAssistantMessage]);
      }

    return (
        <div className="App">
            <aside className="sidemenu">
                <Logout />
                <div className="sidemenu__button" onClick={clearChat}>
                    <span>+</span>
                    New Chat
                </div>
            </aside>
            <section className="chatbox">
                <div className="chat-log">
                    {chatLog.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}

                </div>
                <div className="chat-input-holder">
                    <form onSubmit={handleSubmit}>
                        <input
                            rows="1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="chat-input-textarea"></input>
                    </form>
                </div>
            </section>
        </div>
    );
}

export { Chat };