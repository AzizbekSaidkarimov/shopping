import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link,
  Divider 
} from '@mui/material';
import { Store, Phone, Email, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Store sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                UzbekShop
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              O'zbekistondagi eng yaxshi onlayn do'kon. Sifatli kiyim va poyabzallar.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tezkor havolalar
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="/" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Bosh sahifa
              </Link>
              <Link 
                href="/products" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Mahsulotlar
              </Link>
              <Link 
                href="/products?category=kiyim" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Kiyimlar
              </Link>
              <Link 
                href="/products?category=poyabzal" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Poyabzallar
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Kategoriyalar
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="/products?subcategory=futbolka" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Futbolkalar
              </Link>
              <Link 
                href="/products?subcategory=koylak" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Ko'ylaklar
              </Link>
              <Link 
                href="/products?subcategory=shim" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Shimlar
              </Link>
              <Link 
                href="/products?subcategory=sport" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Sport poyabzallar
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Aloqa
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +998 90 123 45 67
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  info@uzbekshop.uz
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Toshkent, O'zbekiston
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2024 UzbekShop. Barcha huquqlar himoyalangan.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;