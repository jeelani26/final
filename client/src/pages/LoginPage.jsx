// client/src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            // Simple alert for now, as MUI toast requires more setup
            alert('Login Successful!');
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert('Login Failed: Invalid credentials.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Login</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoFocus onChange={(e) => setUsername(e.target.value)} />
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Login</Button>
                </Box>
            </Box>
        </Container>
    );
};
export default LoginPage;