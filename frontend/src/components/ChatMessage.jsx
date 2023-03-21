import React, { useEffect, useState } from 'react'
import { Profile } from './Profile'

const ChatMessage = ({ message, chatLog }) => {
    const [trigger, setTrigger] = useState(false)
    const [profile_image, setProfileImage] = useState('student.png')
    const [errorMessages, setErrorMessages] = useState([])
    // if messages in the chatlog are updated, re-render the chatlog
    const setProfilePicture = async () => {
        const response = await fetch('http://localhost:8000/api/profile/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
            }
        });
        const data = await response.json();
        if (data.error) {
            setErrorMessages(data.detail);
        } else {
            setProfileImage(data.profile_image);
            console.log(data.profile_image)
        }
    }
    useEffect(() => {
        //console.log(chatLog)
        for (let i = 0; i < chatLog.length; i++) {
                message = chatLog[i]
                console.log(message)
                setProfilePicture()
        }
    }, [])

    return (
        <div className={`chat-message ${message.role === "assistant" && "chatgpt"}`}>
            <div className="chat-message-center">

                {(message.user === "assistant" || message.role === "assistant") && <img className='avatar chatgpt' src="AIImam.png" alt="Mufti" />}
                {(message.user === "questioner" || message.role === "questioner") && <img className='avatar' src={ profile_image } alt="questioner" onClick={() => setTrigger(true)} />}
                <Profile trigger={trigger} setTrigger={setTrigger} />
                <div className="message">
                    {message.message}
                </div>
            </div>
        </div>
    )
}

export default ChatMessage