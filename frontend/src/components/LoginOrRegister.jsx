import React from 'react'
import { Login } from './Login'
import { Register } from './Register'

const LoginOrRegister = () => {
  return (
    <div className="container">
        <h1 className="text-center mt-5">Login or Register</h1>
        <div className="row">
            <div className="card col-md-6" style={{backgroundColor: "#333"}}>
                <Login />
            </div>
            <div className="card col-md-6" style={{backgroundColor: "#333"}}>
                <Register />
            </div>
        </div>
    </div>
  )
}

export { LoginOrRegister }