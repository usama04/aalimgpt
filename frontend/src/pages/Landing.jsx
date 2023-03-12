import React from 'react'
import { Nav } from '../components/Nav'

const Landing = () => {
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