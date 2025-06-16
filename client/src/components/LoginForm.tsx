import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Avatar,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNotification } from '../context/NotificationProvider';

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(null);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      // Example API call (replace with your endpoint)
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrorMsg(error.message || 'Incorrect password..!');
        notify(error.message || 'Login failed', 'error');
      } else {
        notify('Login successful!', 'success');
        // Redirect or further logic here
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      notify('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #141E30 0%, #243B55 100%)'
            : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          minWidth: { xs: 320, sm: 400 },
          maxWidth: 440,
          width: '100%',
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        {/* Left side illustration */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            pr: { xs: 1, sm: 3 },
            minWidth: { xs: 90, sm: 160 },
            flexShrink: 0,
          }}
        >
          {/* Replace with your SVG or illustration */}
          <Box
            sx={{
              width: { xs: 70, sm: 120 },
              height: { xs: 70, sm: 120 },
              background: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Example SVG illustration */}
            <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="55" fill="#ffe082" />
              <rect x="30" y="45" width="60" height="35" rx="12" fill="#fff" stroke="#90caf9" strokeWidth="3" />
              <ellipse cx="50" cy="62" rx="6" ry="6" fill="#ffd54f" />
              <ellipse cx="70" cy="62" rx="6" ry="6" fill="#90caf9" />
              <rect x="60" y="55" width="20" height="10" rx="5" fill="#b3e5fc" />
              <polygon points="40,80 50,75 60,80" fill="#fff176" />
              <polygon points="80,80 90,75 100,80" fill="#81d4fa" />
              <circle cx="30" cy="40" r="4" fill="#ffd54f" />
              <circle cx="100" cy="40" r="3" fill="#90caf9" />
              <circle cx="60" cy="25" r="3" fill="#b3e5fc" />
            </svg>
          </Box>
        </Box>
        {/* Right side form */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ pl: { xs: 1, sm: 2 } }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
            NexChat
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            Login
          </Typography>
          {errorMsg && (
            <Typography
              variant="body2"
              sx={{ color: 'error.main', mb: 1, fontWeight: 600, textAlign: 'center' }}
            >
              {errorMsg}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={loginUser}
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              value={form.email}
              onChange={handleChange}
              required
              sx={{ mb: 1 }}
              inputProps={{ style: { fontSize: 15, padding: '8px 10px' } }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              value={form.password}
              onChange={handleChange}
              required
              sx={{ mb: 1 }}
              inputProps={{ style: { fontSize: 15, padding: '8px 10px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1, borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1 }}
              type="submit"
              disabled={loading}
            >
              Login
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" underline="hover" fontSize={13}>
                Register
              </Link>
              </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;