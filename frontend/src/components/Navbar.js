import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  Box,
  Container,
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  Person,
  Menu as MenuIcon,
  Store
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          {/* Logo */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'white',
              mr: 4
            }}
          >
            <Store sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              UzbekShop
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 'auto' }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{ 
                mx: 1,
                fontWeight: isActive('/') ? 600 : 400,
                borderBottom: isActive('/') ? '2px solid white' : 'none'
              }}
            >
              Bosh sahifa
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/products"
              sx={{ 
                mx: 1,
                fontWeight: isActive('/products') ? 600 : 400,
                borderBottom: isActive('/products') ? '2px solid white' : 'none'
              }}
            >
              Mahsulotlar
            </Button>
          </Box>

          {/* Search Bar */}
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              mr: 2,
              minWidth: 250
            }}
          >
            <TextField
              size="small"
              placeholder="Mahsulotlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                  opacity: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      type="submit" 
                      sx={{ color: 'white', p: 0.5 }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Mobile Search Icon */}
          <IconButton 
            color="inherit" 
            sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 }}
            onClick={() => navigate('/products')}
          >
            <Search />
          </IconButton>

          {/* Cart Icon */}
          <IconButton 
            color="inherit" 
            onClick={toggleCart}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={getCartItemsCount()} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* User Menu */}
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
                sx={{ p: 0 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'rgba(255,255,255,0.2)' 
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  onClick={() => {
                    navigate('/profile');
                    handleUserMenuClose();
                  }}
                >
                  Profil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Chiqish
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                startIcon={<Person />}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Kirish
              </Button>
              <IconButton 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ display: { xs: 'flex', sm: 'none' } }}
              >
                <Person />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;