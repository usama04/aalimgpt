import React, { useEffect } from 'react'
import { Nav } from '../components/Nav'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('usertoken')
    if (token.length > 5) {
      navigate('/chat')
    }
  }, [])

  return (
    <div className='App'>
    <div className="container">
        <Nav />
        <div className="container mt-2 pt-5">
            <h1>AalimGPT</h1>
            <p>AI powered chatbot for Islamic scholars</p>
        </div>
    </div>
    </div>
  )
}

export { Landing }