import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const navigate = useNavigate();

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const [errorMessage, setErrorMessage] = useState('');



    const onSubmit = (ev) => {
        ev.preventDefault();

        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const passwordConfirmation = passwordConfirmationRef.current.value;

        // Validation: Check if the password and password confirmation match
        if (password !== passwordConfirmation) {
            setErrorMessage('Password and password confirmation do not match');
            return;
        }


        const payload = {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        };

        axios
            .post('http://127.0.0.1:5000/register', payload)
            .then(({ data }) => {
                console.log('Data:', data);
                navigate('/login');
            })
            .catch((err) => {
                const response = err.response;
                setErrorMessage(response.data.error);
                console.log(response.data.error);
            });
    };



    useEffect(() => {
        document.title = 'Register';
    }, []);

    return (

        <div className="form-container">

            <div className='col-md-9 col-lg-6 col-xl-5'>
                <img src={process.env.PUBLIC_URL + '/../../assets/register.png'} alt='Register Image' className='img-register' />
            </div>
            <form onSubmit={onSubmit} className="register-form">
                <h1 className="title">Register for free</h1>
                <label htmlFor='name'>Name</label>
                <input ref={nameRef} type="text" placeholder="Your full name" className="form-input" id='name' />

                <label htmlFor='email'>Email</label>
                <input ref={emailRef} type="email" placeholder="Your email address" className="form-input" id='email' />

                <label htmlFor='password'>Password</label>
                <input ref={passwordRef} type="password" placeholder="Your password" className="form-input" id='password' />

                <label htmlFor='pass_conf'>Password Confirmation</label>
                <input ref={passwordConfirmationRef} type='password' placeholder='Your password Confirmation' className="form-input" id='pass_conf'></input>

                {errorMessage && <p className="error-message" style={{ backgroundColor: 'red', color: 'white', borderRadius: '3px', textAlign: 'center' }}>{errorMessage}</p>}
                <button type="submit" className="btn btn-block btn-register">
                    Register
                </button>
                <p className="message">
                    Already Registered? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}
