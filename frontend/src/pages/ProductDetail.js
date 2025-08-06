import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Chip,
  Rating,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import { ShoppingCart, Favorite, Share } from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, formatPrice } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Mahsulot topilmadi');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/reviews/product/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validate size selection if sizes are available
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Iltimos, o\'lchamni tanlang');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    alert('Mahsulot savatga qo\'shildi!');
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
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

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Mahsulot topilmadi'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            {/* Main Image */}
            <Box sx={{ mb: 2 }}>
              <img
                src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.nameUz}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </Box>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <Grid container spacing={1}>
                {product.images.map((image, index) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      component="img"
                      src={image.url}
                      alt={`${product.nameUz} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid' : '1px solid',
                        borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                        '&:hover': {
                          borderColor: 'primary.main'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Title and Brand */}
            <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
              {product.nameUz}
            </Typography>
            
            {product.brand && (
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {product.brand}
              </Typography>
            )}

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating?.average || 0} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.rating?.count || 0} ta sharh)
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {formatPrice(product.price)}
              </Typography>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      textDecoration: 'line-through',
                      color: 'text.secondary'
                    }}
                  >
                    {formatPrice(product.originalPrice)}
                  </Typography>
                  <Chip 
                    label={`-${Math.round((1 - product.price / product.originalPrice) * 100)}%`}
                    color="error"
                    size="small"
                  />
                </>
              )}
            </Box>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              {product.totalStock > 0 ? (
                <Chip 
                  label={product.totalStock > 10 ? 'Mavjud' : `Faqat ${product.totalStock} dona qoldi`}
                  color={product.totalStock > 10 ? 'success' : 'warning'}
                />
              ) : (
                <Chip label="Tugagan" color="error" />
              )}
            </Box>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>O'lcham</InputLabel>
                <Select
                  value={selectedSize}
                  label="O'lcham"
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.sizes.map((sizeObj) => (
                    <MenuItem 
                      key={sizeObj.size} 
                      value={sizeObj.size}
                      disabled={sizeObj.stock === 0}
                    >
                      {sizeObj.size} {sizeObj.stock === 0 && '(tugagan)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rang</InputLabel>
                <Select
                  value={selectedColor}
                  label="Rang"
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {product.colors.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Quantity */}
            <TextField
              type="number"
              label="Miqdor"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: product.totalStock }}
              sx={{ mb: 3, width: '120px' }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.totalStock === 0}
                sx={{ flexGrow: 1 }}
              >
                {product.totalStock === 0 ? 'Tugagan' : 'Savatga qo\'shish'}
              </Button>
              <Button variant="outlined" size="large">
                <Favorite />
              </Button>
              <Button variant="outlined" size="large">
                <Share />
              </Button>
            </Box>

            {/* Category */}
            <Typography variant="body2" color="text.secondary">
              Kategoriya: {product.category === 'kiyim' ? 'Kiyimlar' : 
                          product.category === 'poyabzal' ? 'Poyabzallar' : 
                          product.category}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Tavsif" />
          <Tab label="Xususiyatlar" />
          <Tab label={`Sharhlar (${reviews.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {product.descriptionUz}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {product.specifications ? (
            <Grid container spacing={2}>
              {Object.entries(product.specifications).map(([key, value]) => (
                value && (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {key === 'material' ? 'Material' :
                         key === 'weight' ? 'Og\'irlik' :
                         key === 'dimensions' ? 'O\'lchamlar' :
                         key === 'careInstructions' ? 'Parvarish' : key}:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {value}
                      </Typography>
                    </Box>
                    <Divider />
                  </Grid>
                )
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              Xususiyatlar haqida ma'lumot yo'q
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {reviews.length > 0 ? (
            <Box>
              {reviews.map((review) => (
                <Paper key={review._id} sx={{ p: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {review.user?.name}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {review.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.comment}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">
              Hali sharhlar yo'q. Birinchi bo'lib sharh qoldiring!
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ProductDetail;