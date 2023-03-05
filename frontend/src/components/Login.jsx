import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import '../sign-in.css';
import { ErrorMessage } from './ErrorMessage';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useContext(UserContext);
    const [errorMessages, setErrorMessages] = useState([]);

    const submitLogin = async ()  => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify( `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=` ),
        };
        const response = await fetch('http://localhost:8080/api/login', requestOptions);
        const data = await response.json();
        if (data.error) {
            setErrorMessages(data.detail);
        } else {
            setToken(data.access_token);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    }

  return (
    <main className="form-signin w-100 m-auto">
        {errorMessages.length > 0 && <ErrorMessage message={errorMessages} />}
        <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">Please Login</h1>
            <div className="form-group">
                <label htmlFor="username" className="control-label">Email</label>
                <input type="email" className="form-control rounded-2" id="username" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control rounded-2" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
        </form>
    </main>
  )
}

export { Login }