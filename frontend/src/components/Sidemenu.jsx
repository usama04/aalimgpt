import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { Logout } from './Logout'
import { Chat } from './Chat'

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
                    return message.toString().slice(0, 20)
                }
            })
            setPrompts(prompts);
        })
        .catch(error => console.log(error));
    }, [token]);

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
                    {prompt}
                </div>
            ))}
            </div>
        </aside>
    )
}

export { Sidemenu }