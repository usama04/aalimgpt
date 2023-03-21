import React, { useEffect } from 'react'
import { Nav } from '../components/Nav'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/landing.css'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('usertoken')
    if (token.length > 5) {
      navigate('/chat')
    }
  }, [])

  return (
    <div className='App section1'>
      <div className="container">
        <Nav />
        <div className="p-5 rounded-lg m-3">
          <section className="py-5 text-center container">
            <div className="row py-lg-5">
              <div className="col-lg-8 col-md-8 mx-auto">
                <h1 className="fw-light"><img src="logo.png" alt="AalimGPT" width="200" /></h1>
                <p className="lead text-white fs-3">Your AI Islamic Scholar for Quick Answers on Quran and Sharia. Get instant responses to your questions, based on Quranic and Hadith references. AalimGPT is the perfect companion for anyone seeking accessible knowledge on Islamic teachings.</p>
                <p>
                  <Link to="/register" className='text-white nav-link'><button type="button" className="btn btn-success btn-lg my-2">Register</button></Link>
                </p>
                <br />
                <p className="alert alert-warning">Please note that AalimGPT is still a work in progress and its responses may not always be fully accurate or authentic. Use the information provided by AalimGPT at your own discretion and always verify it with other reliable sources.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export { Landing }