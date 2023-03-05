import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'


const Logout = () => {
    const { setToken } = useContext(UserContext);

    const logout = () => {
        setToken(null);
    }

    return (
        <div className='sidemenu__button mb-3' onClick={logout}>Logout</div>
    )
}

export { Logout }