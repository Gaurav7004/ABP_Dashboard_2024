import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import HMIS_login_abp_dashboard from "./assets/images/HMIS_login_abp_dashboard.png";
import Logo from "./assets/images/logo.png";
import digitalIndia from "./assets/images/digital-india.png";
import g20Logo from "./assets/images/g20-logo.png";
import hmisLogo from "./assets/images/hmis.png";
import nrhmLogo from "./assets/images/nrhm-logo.png";
import footer from "./assets/images/footer_abp_dashboard.png";
import Swal from 'sweetalert2';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [response, getResponse] = useState('');
  // const [user_id, getUserID] = useState('');
  const navigate = useNavigate(); // Initialize useHistory



const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:4000/login', { username, password });
    
    // Assuming the server responds with a token upon successful login
    const token = response.data.token;

    // Store the token in localStorage or wherever you prefer
    localStorage.setItem('token', token);

    console.log('Login successful!', response);

    Swal.fire({
      icon: 'success',
      title: 'Login successful!',
      // text: 'Welcome ' + [...new Set(response.map(item => item?.nodal_officer_name))],
      confirmButtonText: 'OK'
    });

    // function getResponse() {
    //   return 'This is the response from Login.js';
    // }

    // navigate('/Home', {"name": "gaurav"} ); // Redirect to the home page

    navigate("/Home", { state: { message: response.data } }); // optional second argument

  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Login failed:', error.response.data);
      Swal.fire({
        icon: 'error',
        title: 'Oops invaid credentials !',
        text: error.message,
        confirmButtonText: 'OK'
      });
    } else {
      console.error('Login failed. An unexpected error occurred.');
    }
  }
};
  

  return (

    <div>
      <div className="header">
        <div className="header_left">
          <h4 style={{ color: 'DodgerBlue', textAlign: 'center', width: '200px' }}>100 Lowest Performing Aspirational Blocks Programme</h4>
          <img src={Logo} style={{ width: '30%' }} alt="Logo"/>
        </div>

        <div>
          <img src={hmisLogo} alt="HMIS Logo"/>
        </div>

        <div className="header_right">
          {/* <img style={{ width: '190px' }} src={g20Logo} alt="G20 Logo" /> */}
          <img src={digitalIndia} alt="Digital India Logo" />
          <img src={nrhmLogo} alt="NRHM Logo" />
        </div> 
      
      </div>


      <div className="header"> 
        <div className="tile_tab1_SC">

          <div className='header' >
            <img className='header_left_login' src={HMIS_login_abp_dashboard} alt="HMIS"/>
          </div>

          <div className="login-form">
            <div className='centered-container'>
              <h3 style={{ color: '#006F96', textAlign: 'center', marginBottom: '10px' }}>SIGN IN</h3>
            </div>

            <div className='centered-container'> 

              <h4 style={{ color: '#006F96', textAlign: 'left', marginBottom: '10px' }}>USER NAME</h4>
              <input
                style={{ width: '90%', textAlign: 'left', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <h4 style={{ color: '#006F96', textAlign: 'left', marginBottom: '10px' }}>PASSWORD</h4>
              <input
                style={{ width: '90%', textAlign: 'left', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            
              <Button className='login-button' onClick={handleLogin} >SIGN IN</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <img className="footer-image" src={footer} alt="HMIS Footer"/>
      </div>

    </div>
   
  );
};


export default Login;