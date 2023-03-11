import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { Logout } from './Logout'

const Sidemenu = ({ chatLog, setChatLog }) => {
    const { token } = useContext(UserContext);
    const [prompts, setPrompts] = useState([]);

    function clearChat() {
        setChatLog([]);
    }

    useEffect(() => {
        fetch('http://localhost:8080/api/chat-history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const prompts = data.map(item => {
                const promptDict = JSON.parse(item.prompt);
                const prompt = JSON.parse(promptDict)
                const message = prompt[0].message
                if (message !== undefined && message.length > 5) {
                    return [message.toString().slice(0, 20), item.id]
                }
            })
            setPrompts(prompts);
        })
        .catch(error => console.log(error));
    }, [token]);

    async function get_chat_history({id}){
        const response = await fetch(`http://localhost:8080/api/chat-history/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
        const prompt = data.prompt
        const bot_response = data.generated_response
        const promptDict = JSON.parse(prompt);
        if (promptDict !== null) {
            const prompt = JSON.parse(promptDict)
            const messages = prompt.map((message) => ({
                role: message.user,
                message: message.message,
            }));
            const newAssistantMessage = { user: bot_response.user, message: bot_response.message };
            setChatLog([...messages, newAssistantMessage]);
        } else {
            const newAssistantMessage = { user: bot_response.user, message: bot_response.message };
            setChatLog([newAssistantMessage]);
        }
        


    }

    return (
        <aside className="sidemenu">
            <Logout />
            <div className="sidemenu__button" onClick={clearChat}>
                <span>+</span>
                New Chat
            </div>
            <div>
            {prompts && prompts.map(prompt => (
                <div className="sidemenu__history" key={prompt}>
                    <span onClick={() => get_chat_history({id: prompt[1]})}>{prompt[0]}</span>
                </div>
            ))}
            </div>
        </aside>
    )
}

export { Sidemenu }