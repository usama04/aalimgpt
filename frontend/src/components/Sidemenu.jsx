import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { Logout } from './Logout'
import { Trash } from 'react-bootstrap-icons'
import { ChangePassword } from './ChangePassword'
import "../styles/Sidemenu.css"

const Sidemenu = ({ chatLog, setChatLog, toggleSideMenu }) => {
    const [ passTrigger, setPassTrigger ] = useState(false);
    const { token } = useContext(UserContext);
    const [prompts, setPrompts] = useState([]);

    function clearChat() {
        setChatLog([]);
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/chat-history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const prompts = data.map(item => {
                // const promptDict = JSON.parse(item.prompt);
                // const prompt = JSON.parse(promptDict)
                // const message = prompt[0].message
                // if (message !== undefined && message.length > 5) {
                //     return [message.toString().slice(0, 20), item.id]
                // }
                const promptList = JSON.parse(item.prompt);
                const messages = promptList.map(prompt => prompt.message);
                const filteredMessages = messages.filter(message => message !== undefined && message.length > 5);
                if (filteredMessages.length > 0) {
                    return [filteredMessages[0].toString().slice(0, 20), item.id];
                }
            })
            setPrompts(prompts);
        })
        .catch(error => console.log(error));
    }, [token]);

    async function get_chat_history({id}){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat-history/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
        const prompt = data.prompt
        const bot_response = data.generated_response
        const bot_response_dict  = JSON.parse(bot_response)
        const promptDict = JSON.parse(prompt);
        if (promptDict !== null) {
            const messages = promptDict.map((message) => ({
                role: message.role,
                message: message.message,
            }));
            const newAssistantMessage = { role: bot_response_dict.user, message: bot_response_dict.message };
            setChatLog([...messages, newAssistantMessage]);
        } else {
            const newAssistantMessage = { role: bot_response_dict.role, message: bot_response_dict.message };
            setChatLog([newAssistantMessage]);
        }

    }

    async function delete_chat_history({id}) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat-history/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
    }

    return (toggleSideMenu &&
        <aside className="sidemenu">
            <div className="mt-5">
                <Logout />
            </div>
            <div className="sidemenu__button mb-3" onClick={() => setPassTrigger(true)}>
                Change Password
            </div>
            <ChangePassword passTrigger={passTrigger} setPassTrigger={setPassTrigger} />
            <div className="sidemenu__button" onClick={clearChat}>
                <span>+</span>
                New Chat
            </div>
            <div>
            {/*prompts && prompts.map(prompt =>
            (
                <div className="sidemenu__history" key={prompt}>
                    <span onClick={() => get_chat_history({id: prompt[1]})}>{prompt[0]}</span><span onClick={() => delete_chat_history({id: prompt[1]})} id="delete"><Trash /></span>
                </div>
            )
            )*/}
            </div>
        </aside>
    )
}

export { Sidemenu }