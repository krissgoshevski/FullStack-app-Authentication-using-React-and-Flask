import React, { useState } from 'react'

export default function useToken() {

    const [token, setToken] = useState(getToken());

    function getToken() {
        const userToken = localStorage.getItem('token'); // Fix: Added 'const' and corrected the variable name
        return userToken && userToken;
    }

    function saveToken(userToken) {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    }

    function removeToken() {
        localStorage.removeItem('token');
        setToken(null);
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}