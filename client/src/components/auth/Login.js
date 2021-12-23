import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Container, FormGroup} from '@mui/material';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Success');
  }

  

  return (
    <Container>
      <h1>Sign In</h1>
      <p>
         Login To Your Account
      </p>
      <form  onSubmit={onSubmit}>
        <FormGroup>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </FormGroup>
        <input type="submit" value="Login" />
      </form>
      <p>
        Don't have an account? <Link to='/register'>Register</Link>
      </p>
    </Container>
  )
}

export default Login;
