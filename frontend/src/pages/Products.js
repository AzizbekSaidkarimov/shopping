import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Paper,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Search,
  FilterList,
  ShoppingCart,
  ExpandMore,
  Clear
} from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, formatPrice } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, currentPage]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0]);
    if (priceRange[1] < 1000000) params.set('maxPrice', priceRange[1]);
    if (sortBy !== 'createdAt') params.set('sort', sortBy);
    if (sortOrder !== 'desc') params.set('order', sortOrder);
    if (currentPage > 1) params.set('page', currentPage);

    setSearchParams(params);
  }, [searchQuery, selectedCategory, priceRange, sortBy, sortOrder, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/products/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', currentPage);
      params.set('limit', '12');

      const response = await axios.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Mahsulotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 1000000]);
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const ProductCard = ({ product }) => (
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
        {product.isFeatured && (
          <Chip
            label="Tavsiya"
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
            label={`-${Math.round((1 - product.price / product.originalPrice) * 100)}%`}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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

        {product.totalStock <= 5 && product.totalStock > 0 && (
          <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
            Faqat {product.totalStock} dona qoldi!
          </Typography>
        )}
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Mahsulotlar
        {total > 0 && (
          <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 2 }}>
            ({total} ta mahsulot)
          </Typography>
        )}
      </Typography>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FilterList sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                Filtrlar
              </Typography>
              <Button 
                size="small" 
                onClick={handleClearFilters}
                startIcon={<Clear />}
              >
                Tozalash
              </Button>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <Button size="small" onClick={handleSearch}>
                      <Search />
                    </Button>
                  )
                }}
              />
            </Box>

            {/* Category Filter */}
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 600 }}>Kategoriya</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Barcha kategoriyalar</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'kiyim' ? 'Kiyimlar' : 
                         category === 'poyabzal' ? 'Poyabzallar' : 
                         category === 'aksessuar' ? 'Aksesuarlar' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>

            {/* Price Range Filter */}
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 600 }}>Narx oralig'i</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000000}
                    step={10000}
                    valueLabelFormat={(value) => formatPrice(value)}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">
                      {formatPrice(priceRange[0])}
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice(priceRange[1])}
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Sort Options */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 600 }}>Saralash</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Saralash turi</InputLabel>
                  <Select
                    value={sortBy}
                    label="Saralash turi"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="createdAt">Sana bo'yicha</MenuItem>
                    <MenuItem value="price">Narx bo'yicha</MenuItem>
                    <MenuItem value="soldCount">Mashhurlik bo'yicha</MenuItem>
                    <MenuItem value="rating.average">Reyting bo'yicha</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Tartib</InputLabel>
                  <Select
                    value={sortOrder}
                    label="Tartib"
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <MenuItem value="desc">Kamayuvchi</MenuItem>
                    <MenuItem value="asc">O'suvchi</MenuItem>
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="400px"
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Hech qanday mahsulot topilmadi
              </Typography>
              <Button 
                variant="outlined" 
                onClick={handleClearFilters}
                sx={{ mt: 2 }}
              >
                Filtrlarni tozalash
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;