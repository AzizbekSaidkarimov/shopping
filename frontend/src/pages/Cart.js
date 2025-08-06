import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    formatPrice 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Savatingiz bo'sh
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Xarid qilish uchun mahsulotlar qo'shing
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          size="large"
        >
          Mahsulotlarni ko'rish
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Savatcha
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={clearCart}
          startIcon={<Delete />}
        >
          Hammasini o'chirish
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Paper key={item.id} sx={{ p: 3, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3} sm={2}>
                  <Box
                    component="img"
                    src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                    alt={item.product.nameUz}
                    sx={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </Grid>
                
                <Grid item xs={9} sm={4}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.product.nameUz}
                  </Typography>
                  {item.product.brand && (
                    <Typography variant="body2" color="text.secondary">
                      {item.product.brand}
                    </Typography>
                  )}
                  {item.selectedSize && (
                    <Typography variant="body2" color="text.secondary">
                      O'lcham: {item.selectedSize}
                    </Typography>
                  )}
                  {item.selectedColor && (
                    <Typography variant="body2" color="text.secondary">
                      Rang: {item.selectedColor}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={4} sm={2}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Grid>

                <Grid item xs={2} sm={1}>
                  <IconButton
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Buyurtma xulosasi
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">
                  Mahsulotlar ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} ta):
                </Typography>
                <Typography variant="body1">
                  {formatPrice(getCartTotal())}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Yetkazib berish:</Typography>
                <Typography variant="body1" color="success.main">
                  Bepul
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Jami:
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                {formatPrice(getCartTotal())}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mb: 2 }}
              disabled
            >
              Buyurtma berish
            </Button>

            <Alert severity="info" sx={{ mt: 2 }}>
              Buyurtma berish funksiyasi hozircha ishlamaydi. Bu demo versiyasi.
            </Alert>

            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Xaridni davom ettirish
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;