import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Rating,
  CircularProgress,
  Alert
} from '@mui/material';
import { ShoppingCart, TrendingUp, Star } from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, formatPrice } = useCart();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredResponse, bestSellersResponse] = await Promise.all([
        axios.get('/products/featured'),
        axios.get('/products/bestsellers')
      ]);

      setFeaturedProducts(featuredResponse.data.products);
      setBestSellers(bestSellersResponse.data.products);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const ProductCard = ({ product, showBadge = false, badgeText = '' }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={product.images?.[0]?.url || '/placeholder-product.jpg'}
          alt={product.nameUz}
          sx={{ objectFit: 'cover' }}
        />
        {showBadge && (
          <Chip
            label={badgeText}
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 600
            }}
          />
        )}
        {product.originalPrice && product.originalPrice > product.price && (
          <Chip
            label="Chegirma"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 600
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.nameUz}
        </Typography>
        
        {product.brand && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.brand}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={product.rating?.average || 0} 
            precision={0.1} 
            size="small" 
            readOnly 
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.rating?.count || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ fontWeight: 600 }}
          >
            {formatPrice(product.price)}
          </Typography>
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography 
              variant="body2" 
              sx={{ 
                textDecoration: 'line-through',
                color: 'text.secondary'
              }}
            >
              {formatPrice(product.originalPrice)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/products/${product._id}`}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mr: 1 }}
        >
          Ko'rish
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<ShoppingCart />}
          onClick={() => handleAddToCart(product)}
          disabled={product.totalStock === 0}
        >
          {product.totalStock === 0 ? 'Tugagan' : 'Savatga'}
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                UzbekShop'ga xush kelibsiz!
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Eng sifatli kiyim va poyabzallarni topishning eng oson yo'li
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 600,
                    px: 4,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Mahsulotlarni ko'rish
                </Button>
                <Button
                  component={Link}
                  to="/products?category=kiyim"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Kiyimlar
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src="/hero-image.jpg"
                alt="Shopping"
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Star sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                Tavsiya etiladigan mahsulotlar
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard 
                    product={product} 
                    showBadge={true}
                    badgeText="Tavsiya"
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                component={Link}
                to="/products?featured=true"
                variant="outlined"
                size="large"
              >
                Barcha tavsiya etiladigan mahsulotlar
              </Button>
            </Box>
          </Box>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                Eng ko'p sotiladigan mahsulotlar
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {bestSellers.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard 
                    product={product}
                    showBadge={true}
                    badgeText="Hit"
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                component={Link}
                to="/products?sort=soldCount&order=desc"
                variant="outlined"
                size="large"
              >
                Barcha mashhur mahsulotlar
              </Button>
            </Box>
          </Box>
        )}

        {/* Categories Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}
          >
            Kategoriyalar
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                component={Link}
                to="/products?category=kiyim"
                sx={{
                  textDecoration: 'none',
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    Kiyimlar
                  </Typography>
                  <Typography variant="h6">
                    Zamonaviy va sifatli kiyimlar
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card
                component={Link}
                to="/products?category=poyabzal"
                sx={{
                  textDecoration: 'none',
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #42a5f5, #1976d2)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    Poyabzallar
                  </Typography>
                  <Typography variant="h6">
                    Qulay va chiroyli poyabzallar
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;