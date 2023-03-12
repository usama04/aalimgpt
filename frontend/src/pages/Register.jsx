import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import '../sign-in.css';
import { ErrorMessage } from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // [password, setPassword] = useState('') is a destructuring assignment
    const [confirmPassword, setConfirmPassword] = useState(''); // [confirmPassword, setConfirmPassword] = useState('') is a destructuring assignment
    const { setToken } = useContext(UserContext);
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    const submitRegistration = async (e) => {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                first_name: firstName,
                last_name: lastName,
                hashed_password: password,
                confirm_password: confirmPassword
            })
        });
        const data = await response.json();
        if (data.error) {
            setErrorMessages(data.detail);
        } else {
          setToken(data.access_token);
          navigate('/chat');
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword && password.length > 5) {
            submitRegistration();
        } else {
            setErrorMessages(['Passwords do not match or are less than 6 characters']);
        }
    }

  return (
    <div className="App">
      <Nav />
    <main className="form-signin w-100 m-auto pt-5 mt-5">
    {errorMessages.length > 0 && <ErrorMessage message={errorMessages} />}
    <form onSubmit={handleSubmit}>
    <h1 className="h3 mb-3 fw-normal">Please Register</h1>
    <div className="form-group">
      <label htmlFor="firstName" className="control-label">First Name</label>
      <input type="text" className="form-control rounded-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="First Name" />
      
    </div>
    <div className="form-group">
      <label htmlFor="lastName">Last Name</label>
      <input type="text" className="form-control rounded-2" value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName" placeholder="Last Name" />
    </div>
    <div className="form-group">
      <label htmlFor="email">Email address</label>
      <input type="email" className="form-control rounded-2" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Email address" />
    </div>
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input type="password" className="form-control rounded-2" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Password" />
    </div>
    <div className="form-group">
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input type="password" className="form-control rounded-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" placeholder="Confirm Password" />
    </div>
    <button className="w-100 btn btn-lg btn-success" type="submit">Register</button>
  </form>
  </main>
  </div>
  )
}

export { Register }