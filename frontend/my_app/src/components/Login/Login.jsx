import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(props) {

    const navigate = useNavigate();

    const [LoginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    function handleChange(event) {
        const { value, name } = event.target;

        setLoginForm(prevNote => ({
            ...prevNote,
            [name]: value,
        }));
    }

    function buttonLogin(event) {
        axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/login',
            data: {
                email: LoginForm.email,
                password: LoginForm.password
            }
        }).then((response) => {
            console.log(response);
            props.setToken(response.data.token);
            alert("Successfully Logged In");
            localStorage.setItem('email', LoginForm.email);
            navigate('/user/details/');
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);

                if (error.response.status === 400) {
                    alert('Email and passworda re required!');
                }

                if (error.response.status === 401) {
                    alert('Invalid credentials');
                }

                if (error.response.status === 404) {
                    alert('Not found this user, Invalid email or password');
                }
            }
        });
        event.preventDefault();
    }

    useEffect(() => {
        document.title = 'Login';
    }, []);

    return (
        <div className='container h-50'>
            <div className='container-fluid h-custom'>
                <div className='row d-flex justify-content-center align-items-center h-50'>
                    <div className='col-md-9 col-lg-6 col-xl-5'>
                        <img src={process.env.PUBLIC_URL + '/../../assets/auth.png'} alt='Auth Image' className='img-fluid' />
                    </div>

                    <div className='col-md-8 col-lg-6 col-xl-4 offset-xl-1'>
                        <form className='login-form'>
                            <div className='d-flex flex-row align-items-center justify-content-center justify-content-lg-start'>
                                <h1 className='log-into'>Log Into Your Account</h1>
                            </div>

                            <div className='mb-4'>
                                <label htmlFor='email' className='form-label'>Email address</label>
                                <input
                                    type='email'
                                    placeholder='Your email'
                                    value={LoginForm.email}
                                    onChange={handleChange}
                                    className='form-control'
                                    name='email'
                                    id='email'
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='password' className='form-label'>Password</label>
                                <input
                                    type='password'
                                    placeholder='Your password'
                                    value={LoginForm.password}
                                    onChange={handleChange}
                                    className='form-control'
                                    name='password'
                                    id='password'
                                />
                            </div>

                            <div className='mb-3 form-check'>
                                <input type='checkbox' className='form-check-input small-checkbox' id='remember_ch' />
                                <label htmlFor='remember_ch' className='form-check-label'>Remember me</label>
                                <Link to='#!' className='link-danger ms-5'>Forgot password?</Link>
                            </div>

                            <div className='text-center text-lg-start mt-4 pt-2'>
                                <button type='submit' className='btn btn-primary btn-lg' onClick={buttonLogin}>Login</button>
                                <p className='small fw-bold mt-2 pt-1 mb-0'>Don't have an account?
                                    <Link to='/register' className='link-danger ms-1'>Register</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
