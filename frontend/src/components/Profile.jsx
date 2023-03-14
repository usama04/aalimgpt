import React, { useState, useEffect } from 'react'
import { ErrorMessage } from './ErrorMessage'
import { SuccessMessage } from './SuccessMessage'

function Profile(props) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [bio, setBio] = useState('')
    const [location, setLocation] = useState('')
    const [dob, setDob] = useState('')
    const [errorMessages, setErrorMessages] = useState([])
    const [successMessages, setSuccessMessages] = useState([])

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:8080/api/profile/me', {
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
                setBio(data.bio);
                setLocation(data.location);
                setDob(data.dob);
            }
        }
        fetchProfile();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:8080/api/profile/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
            },
            body: JSON.stringify({
                bio: bio,
                location: location,
                dob: dob
            })
        });
        const data = await response.json();
        if (data.error) {
            setErrorMessages(data.detail);
        } else {
            setSuccessMessages(data.detail);
        }
    }

    
  return ( props.trigger ) ? (
    <div className='popup'>
        <div className="popup-inner">
            <button className="btn btn-danger btn-close" onClick={() => props.setTrigger(false)}></button>
            {errorMessages.length > 0 && <ErrorMessage message={errorMessages} />}
            {successMessages.length > 0 && <SuccessMessage message={successMessages} />}
            {props.children}
            <h1 className="h3 mb-3 fw-normal">Edit Profile</h1>
        <form className="form-group" onSubmit={handleSubmit}>
            <label htmlFor="firstName" className="control-label">First Name</label>
            <input type="text" className="form-control rounded-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName" />
            <label htmlFor="lastName" className="control-label">Last Name</label>
            <input type="text" className="form-control rounded-2" value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName" />
        </form>
        <form>
            <label htmlFor="bio" className="control-label">Bio</label>
            <input type="text" className="form-control rounded-2" value={bio} onChange={(e) => setBio(e.target.value)} id="bio" />
            <label htmlFor="location" className="control-label">Location</label>
            <input type="text" className="form-control rounded-2" value={location} onChange={(e) => setLocation(e.target.value)} id="location" />
            <label htmlFor="dob" className="control-label">Date of Birth</label>
            <input type="text" className="form-control rounded-2" value={dob} onChange={(e) => setDob(e.target.value)} id="dob" />
        </form>
        <button className="w-100 btn btn-lg btn-success" type="submit" onClick={handleSubmit}>Submit</button>
        </div>
        </div>
    ) : "";

}

export { Profile }