import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Container, FormGroup} from '@mui/material';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      // setAlert('Passwords do not match', 'danger');
      console.log('Passwords do not match');
    } else {
      // register({name, email, password});
      console.log(formData);
    }
  }

  

  return (
    <Container>
      <h1>Sign Up</h1>
      <p>
         Create Your Account
      </p>
      <form  onSubmit={onSubmit}>
        <FormGroup>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <FormGroup>
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
          />
        </FormGroup>
        <input type="submit" value="Register" />
      </form>
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Container>
  )
}

export default Register;
