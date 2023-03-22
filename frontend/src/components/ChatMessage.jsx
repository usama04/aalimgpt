import React, { useEffect, useState } from 'react'
import { Profile } from './Profile'
import { HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons'
import { AltAnswer } from './AltAnswer'
import { ErrorMessage } from './ErrorMessage'


const ChatMessage = ({ message, chatLog }) => {
    const [trigger, setTrigger] = useState(false)
    const [profile_image, setProfileImage] = useState('student.png')
    const [errorMessages, setErrorMessages] = useState([])
    const [answerTrigger, setAnswerTrigger] = useState(false)
    const [responseRating, setResponseRating] = useState(0)
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
            if (data.profile_image === null) {
                setProfileImage('student.png')
            } else {
            setProfileImage(data.profile_image);
            }
        }
    }
    useEffect(() => {
        //console.log(chatLog)
        for (let i = 0; i < chatLog.length; i++) {
                message = chatLog[i]
                setProfilePicture()
        }
    }, [])

    return (
        <div className={`chat-message ${message.role === "assistant" && "chatgpt"}`}>
            {errorMessages.length > 0 && <ErrorMessage message={errorMessages} />}
            <div className="chat-message-center">

                {(message.user === "assistant" || message.role === "assistant") && <img className='avatar chatgpt' src="AIImam.png" alt="Mufti" />}
                {(message.user === "questioner" || message.role === "questioner") && <img className='avatar' src={ profile_image } alt="questioner" onClick={() => setTrigger(true)} />}
                <Profile trigger={trigger} setTrigger={setTrigger} />
                <div className="message">
                    {message.message}
                    {(message.user === "assistant" || message.role === "assistant" ) && <div className="thumbs">
                        <button onClick={() => setResponseRating(1)}><HandThumbsUp className="thumbs-up" /></button>
                        <button onClick={() => {
                            setResponseRating(-1)
                            setAnswerTrigger(true)}
                        }><HandThumbsDown className="thumbs-down" /></button>
                    </div>
                    }
                </div>
                <AltAnswer answertrigger={answerTrigger} setAnswerTrigger={setAnswerTrigger} chat_id={message.chat_id} responseRating={responseRating} />
            </div>
        </div>
    )
}

export default ChatMessage