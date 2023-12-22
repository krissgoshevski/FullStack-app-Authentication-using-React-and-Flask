import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDetails(props) {
    // vo localstorage gi imame token i email 
    const email = localStorage.getItem('email');
    // console.log(email);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        axios({
            method: 'GET',
            url: `http://127.0.0.1:5000/user/details/${email}`,
            headers: {
                Authorization: `Bearer ${props.token}` // Make sure to include a space after 'Bearer'
            }
        })
            .then((response) => {
                const data = response.data;
                console.log(response);

                setProfileData({
                    username: data.name,
                    email: data.email,
                    description: data.description
                });
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                }
            });
    }

    return (
        <div className="container">
            <div className="user-details">
                <div className="col col-lg-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <h4>User Details</h4>
                        </div>
                        <div className="card-body">
                            {profileData ? (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Name:
                                        </label>
                                        <p id="name" className="form-text">{profileData.username}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email:
                                        </label>
                                        <p id="email" className="form-text">{profileData.email}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Description:
                                        </label>
                                        <p id="description" className="form-text">{profileData.description}</p>
                                    </div>
                                </>
                            ) : (
                                <p>Loading user details...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
