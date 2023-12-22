import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import UserDetails from './components/UserDetails/UserDetails';
import useToken from './components/Token/useToken';
import Header from './components/Header/Header';
import Register from './components/Register/Register';



function App() {
  const { token, setToken, removeToken } = useToken();

  return (
    <div className='vh-100 gradient-custom'>
      <div className='container'>
        <h1 className='page-header text-center'>
          {/* React & Flask with Authenticaiton */}
        </h1>

        <BrowserRouter>
          {token && token !== '' && token !== undefined && <Header token={removeToken} />}

          <Routes>
            <Route
              path='/'
              element={<Navigate to='/register' />}  // Redirect to /login if accessing the root path
            />
            <Route path='/register' element={<Register />} />
            {!token && token !== '' && token !== undefined ? (
              <Route path='/login' element={<Login setToken={setToken} />} />
            ) : (
              <Route
                path='/user/details/'
                element={
                  token ? <UserDetails token={token} setToken={setToken} /> : <Navigate to='/login' />
                }
              />
            )}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
