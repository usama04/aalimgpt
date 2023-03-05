import React from 'react'

const ChatMessage = ({ message }) => {
    return (
        <div className={`chat-message ${message.user === "assistant" && "chatgpt"}`}>
            <div className="chat-message-center">

                {message.user === "assistant" && <img className='avatar chatgpt' src="AIImam.png" alt="Mufti" />}
                {message.user === "questioner" && <img className='avatar' src="student.png" alt="questioner" />}

                <div className="message">
                    {message.message}
                </div>
            </div>
        </div>
    )
}

export default ChatMessage