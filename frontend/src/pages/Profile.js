import React from 'react';
import { Container, Typography, Paper, Box, Button, Alert } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Person sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Profil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Shaxsiy ma'lumotlaringizni boshqaring
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Bu demo versiya. Profil tahrirlash funksiyasi hozircha ishlamaydi.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Asosiy ma'lumotlar
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Ism:</strong> {user?.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Rol:</strong> {user?.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" disabled>
            Profilni tahrirlash
          </Button>
          <Button variant="outlined" color="error" onClick={logout}>
            Chiqish
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;