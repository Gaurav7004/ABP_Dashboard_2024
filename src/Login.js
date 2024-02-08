import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [response, getResponse] = useState('');
  // const [user_id, getUserID] = useState('');
  const navigate = useNavigate(); // Initialize useHistory

                

//   // Example in Login.js
//   const handleLogin = async () => {
//     try {
//       axios.get('http://localhost:4000/State', { username, password})
//       .then(navigate('/Home'))
//       .catch(err => console.log(err));


//       console.log(username, password)

//       console.log('@@@@@@@@@@@@@@@@@@@2 TESTED')

//       // console.log('Login successful!');
//       // navigate('/Home'); // Redirect to the home page
//     } 
//     catch (error) {
//       if (error.response && error.response.data) {
//         console.error('Login failed:', error.response.data);
//       } else {
//         console.error('Login failed. An unexpected error occurred.');
//       }
//     }
//   };


const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:4000/login', { username, password });
    
    // Assuming the server responds with a token upon successful login
    const token = response.data.token;

    // Store the token in localStorage or wherever you prefer
    localStorage.setItem('token', token);

    console.log('Login successful!');

    // function getResponse() {
    //   return 'This is the response from Login.js';
    // }

    // navigate('/Home', {"name": "gaurav"} ); // Redirect to the home page

    navigate("/Home", { state: { message: response.data } }); // optional second argument

  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Login failed:', error.response.data);
    } else {
      console.error('Login failed. An unexpected error occurred.');
    }
  }
};
  

  return (
    <div className="main">
        <h4>Sign In</h4>
      <input className="row"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input className="row"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="row" onClick={handleLogin}>Sign in</button>
    </div>

    // <div className="main">
    //     <h4>Sign In</h4>
    //     <form onSubmit={this.handleSubmit}>
    //       <div>
    //         <input
    //             type="text"
    //             placeholder="Username"
    //             value={username}
    //             onChange={(e) => setUsername(e.target.value)}
    //         />
    //       </div>
    //       <div>
    //         <input
    //             type="password"
    //             placeholder="Password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //         />
    //       </div>
    //       <input
    //         type="submit"
    //         value="SIGN IN"
    //         className="btn"

    //       />
    //     </form>
    //     <button className='button' onClick={handleLogin}>Login</button>
    //   </div>
  );
};


export default Login;