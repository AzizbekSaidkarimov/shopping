import React from 'react';
import { Container, Typography, Paper, Box, Alert, Button } from '@mui/material';
import { Inventory, Add } from '@mui/icons-material';

const AdminProducts = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Inventory sx={{ mr: 2, fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Mahsulotlar boshqaruvi
              </Typography>
            </Box>
            <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main' }} startIcon={<Add />}>
              Yangi mahsulot
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Bu sahifada admin mahsulotlarni qo'shish, tahrirlash va o'chirish imkoniyatiga ega bo'ladi.
          MongoDB ulanmagan holda bu funksiya ishlamaydi.
        </Alert>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Mahsulotlar ro'yxati
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
              Mahsulotlar ro'yxati bu yerda ko'rsatiladi
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminProducts;