import React from 'react';
import { Container, Typography, Paper, Box, Alert } from '@mui/material';
import { RateReview } from '@mui/icons-material';

const AdminReviews = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RateReview sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Sharhlar boshqaruvi
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Bu sahifada admin barcha sharhlarni ko'rish, tasdiqlash va moderatsiya qilish imkoniyatiga ega bo'ladi.
        </Alert>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sharhlar ro'yxati
          </Typography>
          <Box 
            sx={{ 
              height: 400, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'grey.100',
              borderRadius: 1
            }}
          >
            <Typography color="text.secondary">
              Sharhlar ro'yxati bu yerda ko'rsatiladi
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminReviews;