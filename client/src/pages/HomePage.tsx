import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SettingsIcon from '@mui/icons-material/Settings';

const chats = [
  { id: 1, name: 'Swati - THN', lastMsg: 'typing...', avatar: '', active: true },
  { id: 2, name: 'Chintu Voda', lastMsg: 'Inbox to center', avatar: '', active: false },
  { id: 3, name: 'Pinder whatzap', lastMsg: 'Yesterday', avatar: '', active: false },
  // ...add more chats as needed
];

const Sidebar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: { xs: 90, sm: 320 },
        minWidth: { xs: 90, sm: 260 },
        maxWidth: 340,
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box display="flex" alignItems="center" p={2} gap={1}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <ChatBubbleOutlineIcon />
        </Avatar>
        <Typography variant="h6" fontWeight={700} sx={{ display: { xs: 'none', sm: 'block' } }}>
          NexChat
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, pb: 7 }}>
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.id}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: chat.active ? 'primary.light' : 'transparent',
                '&:hover': { bgcolor: 'primary.lighter' },
                cursor: 'pointer',
              }}
              disablePadding
            >
              <ListItemButton selected={chat.active}>
                <ListItemAvatar>
                  <Avatar src={chat.avatar}>{chat.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography fontWeight={chat.active ? 700 : 500} fontSize={16}>
                      {chat.name}
                    </Typography>
                  }
                  secondary={
                    <Typography color="text.secondary" fontSize={13}>
                      {chat.lastMsg}
                    </Typography>
                  }
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* Fixed Drop-up Settings Button with Icon and Text */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 1300,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<SettingsIcon />}
          onClick={handleSettingsClick}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            px: 2.5,
            py: 1.2,
            fontWeight: 600,
            bgcolor: 'background.paper',
            color: 'primary.main',
            '&:hover': { bgcolor: 'grey.100' },
            textTransform: 'none',
          }}
        >
          Settings
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSettingsClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              mb: 1,
              borderRadius: 2,
              minWidth: 180,
            },
          }}
        >
          <MenuItem onClick={handleSettingsClose}>Profile</MenuItem>
          <MenuItem onClick={handleSettingsClose}>Theme</MenuItem>
          <MenuItem onClick={handleSettingsClose}>Logout</MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

export default Sidebar;