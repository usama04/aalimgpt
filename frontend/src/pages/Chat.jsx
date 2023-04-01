import { React, useState, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import { Sidemenu } from '../components/Sidemenu';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidemenu.css'
// import bars icon from bootstrap
import { ThreeDotsVertical } from 'react-bootstrap-icons';

const Chat = () => {

    // add state for input and chat log
    const [input, setInput] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [fullChatLog, setFullChatLog] = useState([]);
    const token = localStorage.getItem('usertoken');
    const navigate = useNavigate();
    const [toggleSideMenu, setToggleSideMenu] = useState(true);

    useEffect(() => {
      if (token === null || token === undefined) {
        navigate('/login');
      }
    }, [token, navigate]);

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
    
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mufti`, {
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
        const newAssistantMessage = { user: data.user, message: data.message, chat_id: data.chat_id };
        setChatLog([...chatLogNew, newAssistantMessage]);
        setFullChatLog([...fullChatLogNew, newAssistantMessage]);
      }

    return (
        <div className="App">
            <Sidemenu chatLog={chatLog} setChatLog={setChatLog} toggleSideMenu={toggleSideMenu} />
            <section className="chatbox">
                <div className="chat-log">
                    {chatLog.map((message, index) => (
                        <ChatMessage key={index} message={message} chatLog={chatLog} />
                    ))}

                </div>
                <div className="chat-input-holder">
                  <div className="side-menu-toggle-btn" onClick={() => setToggleSideMenu(!toggleSideMenu)}>
                    <ThreeDotsVertical />
                  </div>
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