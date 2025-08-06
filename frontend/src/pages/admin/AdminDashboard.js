import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Alert
} from '@mui/material';
import { Dashboard, TrendingUp, People, ShoppingBag, Star } from '@mui/icons-material';

const AdminDashboard = () => {
  const stats = [
    { title: 'Jami mahsulotlar', value: '50', icon: ShoppingBag, color: '#1976d2' },
    { title: 'Jami foydalanuvchilar', value: '0', icon: People, color: '#2e7d32' },
    { title: 'Jami buyurtmalar', value: '0', icon: TrendingUp, color: '#ed6c02' },
    { title: 'Jami sharhlar', value: '0', icon: Star, color: '#9c27b0' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Dashboard sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          Bu demo versiya. MongoDB ulanmagan, shuning uchun real ma'lumotlar ko'rsatilmaydi.
          Haqiqiy ishlatish uchun MongoDB connection string-ni .env fayliga qo'shing.
        </Alert>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  borderLeft: `4px solid ${stat.color}`
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: `${stat.color}20`,
                    mr: 2
                  }}
                >
                  <stat.icon sx={{ fontSize: 32, color: stat.color }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Daromad grafigi
              </Typography>
              <Box 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1
                }}
              >
                <Typography color="text.secondary">
                  Grafik ma'lumotlari mavjud emas
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                So'nggi buyurtmalar
              </Typography>
              <Box 
                sx={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1
                }}
              >
                <Typography color="text.secondary">
                  Buyurtmalar mavjud emas
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Eng ko'p sotiladigan mahsulotlar
              </Typography>
              <Box 
                sx={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1
                }}
              >
                <Typography color="text.secondary">
                  Ma'lumotlar mavjud emas
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Kam qolgan mahsulotlar
              </Typography>
              <Box 
                sx={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1
                }}
              >
                <Typography color="text.secondary">
                  Ma'lumotlar mavjud emas
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;