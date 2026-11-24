import React, { useState } from 'react';
import axios from 'axios';

function CookieLogin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/login/',
        { username, password },
        { withCredentials: true }
      );

      setMessage('Login successful!');
      console.log(response.data);
    } catch (error) {
      setMessage('Login failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label><br/>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label><br/>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Log In</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CookieLogin;