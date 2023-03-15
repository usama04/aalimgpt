import React, { useEffect, useState } from 'react'
import { Profile } from './Profile'

const ChatMessage = ({ message, chatLog }) => {
    const [trigger, setTrigger] = useState(false)
    const [profileImage, setProfileImage] = useState('student.png')
    const [errorMessages, setErrorMessages] = useState([])
    // if messages in the chatlog are updated, re-render the chatlog
    useEffect(() => {
        //console.log(chatLog)
        for (let i = 0; i < chatLog.length; i++) {
                message = chatLog[i]
                console.log(message)
        }
    }, [])

    useEffect(() => {
        if (message.user === "questioner" || message.role === "questioner") {
            setProfileImage(() => {
                const img = fetch('http://localhost:8080/api/profile/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
                    }
                });
                const data = img.json();
                if (data.error) {
                    setErrorMessages(data.detail);
                }
                return data.profile_image
            })
        }
    }, [message])

    return (
        <div className={`chat-message ${message.role === "assistant" && "chatgpt"}`}>
            <div className="chat-message-center">

                {(message.user === "assistant" || message.role === "assistant") && <img className='avatar chatgpt' src="AIImam.png" alt="Mufti" />}
                {(message.user === "questioner" || message.role === "questioner") && <img className='avatar' src="{ setProfileImage }" alt="questioner" onClick={() => setTrigger(true)} />}
                <Profile trigger={trigger} setTrigger={setTrigger} />
                <div className="message">
                    {message.message}
                </div>
            </div>
        </div>
    )
}

export default ChatMessage