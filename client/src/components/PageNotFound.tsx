import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      }}
    >
      <Typography variant="h1" color="primary" fontWeight={700} gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ borderRadius: 2, px: 4, py: 1, mb: 1 }}
      >
        Go to Previous Page
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ borderRadius: 2, px: 4, py: 1 }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default PageNotFound;