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
  Tooltip,
  CircularProgress,
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNotification } from '../context/NotificationProvider';

type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic: File | null;
};

const Register: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: null,
  });
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files) {
      setForm((prev) => ({ ...prev, profilePic: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      if (form.profilePic) formData.append('profilePic', form.profilePic);

      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        notify(error.message || 'Registration failed', 'error');
      } else {
        notify('Registration successful!', 'success');
        setForm({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          profilePic: null,
        });
      }
    } catch {
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
        ? 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' // deep blue gradient for dark mode
        : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  }}
>
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          minWidth: { xs: 280, sm: 340 },
          maxWidth: 400,
          width: '100%',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          width="100%"
          justifyContent="center"
          mb={1}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              mr: 2,
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
              NexChat
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1 }}>
              Register
            </Typography>
          </Box>
        </Box>
        <Box
          component="form"
          onSubmit={registerUser}
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <TextField
            label="Username"
            name="username"
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
            value={form.username}
            onChange={handleChange}
            required
            sx={{ mb: 1 }}
            inputProps={{ style: { fontSize: 14, padding: '8px 10px' } }}
          />
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
            inputProps={{ style: { fontSize: 14, padding: '8px 10px' } }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
            value={form.password}
            onChange={handleChange}
            required
            sx={{ mb: 1 }}
            inputProps={{ style: { fontSize: 14, padding: '8px 10px' } }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            sx={{ mb: 1 }}
            inputProps={{ style: { fontSize: 14, padding: '8px 10px' } }}
          />
          <Stack direction="row" alignItems="center" spacing={1} width="100%" sx={{ mb: 1 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-pic-upload"
              type="file"
              name="profilePic"
              onChange={handleChange}
            />
            <label htmlFor="profile-pic-upload">
              <Tooltip title="Add profile picture">
                <IconButton component="span" color={form.profilePic ? 'success' : 'default'} size="small">
                  <AddAPhotoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </label>
            <Typography variant="body2" color={form.profilePic ? 'success.main' : 'text.secondary'} fontSize={13}>
              Add profile picture
            </Typography>
            {form.profilePic && (
              <Typography variant="body2" color="success.main" fontSize={13}>
                &#9679;
              </Typography>
            )}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1, borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1 }}
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            Register
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>
            Already have an account?{' '}
            <Link href="/login" underline="hover" fontSize={13}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register