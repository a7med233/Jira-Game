import React, { useState } from 'react';

import './LoginForm.css';

function LoginForm({ login, register }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        if (isRegistering) {
            register(username, password);
        } else {
            login(username, password);
        }
    };

    return (
        <div className="login-form">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                /><br/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                /><br/>
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Have an account? Login' : 'Need an account? Register'}
            </button>
        </div>
    );

}

export default LoginForm;