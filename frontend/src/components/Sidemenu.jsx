import React from 'react'
import { Logout } from './Logout'

const Sidemenu = ({ chatLog, setChatLog }) => {

    function clearChat() {
        setChatLog([]);
    }

    return (
        <aside className="sidemenu">
            <Logout />
            <div className="sidemenu__button" onClick={clearChat}>
                <span>+</span>
                New Chat
            </div>
        </aside>
    )
}

export { Sidemenu }