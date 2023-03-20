import React, { useState, useEffect, useRef } from 'react'
import { ErrorMessage } from './ErrorMessage'
import { SuccessMessage } from './SuccessMessage'

function Profile(props) {
    const inputRef = useRef();
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [bio, setBio] = useState('')
    const [location, setLocation] = useState('')
    const [dob, setDob] = useState('')
    const [errorMessages, setErrorMessages] = useState([])
    const [successMessages, setSuccessMessages] = useState([])

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:8000/api/profile/me', {
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
        const fetchUser = async () => {
            const response = await fetch('http://localhost:8000/api/users/me', {
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
                setFirstName(data.firstName);
                setLastName(data.lastName);
            }
        }
        fetchUser();
        fetchProfile();
    }, [])

    const updateUser = async () => {
        const response = await fetch('http://localhost:8000/api/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName
            })
        });
        const data = await response.json();
        if (data.error) {
            setErrorMessages(data.detail);
        } else {
            setSuccessMessages(data.detail);
        }
    }

    const updateProfile = async () => {
        const response = await fetch('http://localhost:8000/api/profile/me', {
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


    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateUser();
        await updateProfile();
    }

    const handleProfilePic = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', inputRef.current.files[0]);
        const response = await fetch('http://localhost:8000/api/profile/me/upload-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
            },
            body: formData
        });
        const data = await response.json();
        if (data.error) {
            setErrorMessages(data.detail);

        } else {
            setSuccessMessages(data.detail);
        }
    };

    return (props.trigger) ? (
        <div className='popup'>
            <div className="popup-inner">
                <button className="btn btn-danger btn-close" onClick={() => props.setTrigger(false)}></button>
                {props.children}
                <h1 className="h3 mb-3 fw-normal">Edit Profile</h1>
                <form className="form-group" onSubmit={handleProfilePic}>
                    <label htmlFor="file" className="control-label">Profile Picture</label>
                    <input type="file" className="form-control rounded-2" id="file" name="file" aria-describedby="button-addon2" ref={inputRef} />
                    <button className="btn btn-outline-primay btn-success" onClick={handleProfilePic} id="button-addon2">Upload</button>
                </form>
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