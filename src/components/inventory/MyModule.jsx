import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  Paper, 
  Typography, 
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddProductForm from './AddProductForm';
import ProductDetailsForm from './ProductDetailsForm';
import ProductList from './ProductList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionDiv = motion.div;

const GradientBox = styled(MotionBox)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  textAlign: 'left',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[3]
  }
}));

const HeaderText = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  gap: 16
});

const SubtitleText = styled(Typography)(({ theme }) => ({
  opacity: 0.85,
  fontStyle: 'italic',
  fontSize: '0.9rem',
  color: theme.palette.common.white
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: '600',
  minHeight: 60,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const INITIAL_PRODUCT_STATE = {
  name: '',
  description: '',
  price: '',
  images: [], // Changed from 'image' to support multiple File objects
  previewImages: [], // Kept for UI previews
  previewImage: '', // Kept for backward compatibility
  category: '',
  stock: 0,
  sku: '',
  weight: '',
  dimensions: '',
  hsn_code: '',
  barcodeType: 'EAN-13',
  barcode: '',
  unit: '',
  status: 'Active',
  condition: '',
  cost_price: '',
  base_price: '',
  tax_rate: '',
  pricing_levels: [
    { level: 'Direct Purchase', price: '', discount: 0, final_price: '' },
    { level: 'B2B(sales price)', price: '', discount: 5, final_price: '' },
    { level: 'B2C(sales price )', price: '', discount: 10, final_price: '' },
  ],
  attributes: [],
  colors: [],
  sizes: [],
  material: '',
  brand: '',
  productType: '' // Added to support productType from AddProductForm
};

const MyModule = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch product list on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const response = await axios.get('/api/v1/products/list');
        const response = await axios.get('http://localhost:8000/api/v1/products/list');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product list:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch products. Please try again later.',
          severity: 'error'
        });
      }
    };
    fetchProducts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateFinalPrice = (price, discount) => {
    console.log("this is price", price);
    if (!price || isNaN(price)) return '';
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount) || 0;
    return (numericPrice * (1 - numericDiscount / 100)).toFixed(2);
  };

  const handleDeletePricingLevel = (index) => {
    const updatedLevels = [...newProduct.pricing_levels];
    updatedLevels.splice(index, 1);
    setNewProduct({
      ...newProduct,
      pricing_levels: updatedLevels
    });
  };

  const handleAddPricingLevel = () => {
    setNewProduct({
      ...newProduct,
      pricing_levels: [
        ...newProduct.pricing_levels,
        { level: 'New Level', price: '', discount: 0, final_price: '' }
      ]
    });
  };

  const handleAddAttribute = () => {
    if (!selectedAttribute) {
      setSnackbar({
        open: true,
        message: 'Please select an attribute type',
        severity: 'error'
      });
      return;
    }

    const newAttribute = {
      name: selectedAttribute,
      value: attributeValue
    };

    setNewProduct({
      ...newProduct,
      attributes: [...newProduct.attributes, newAttribute]
    });

    setSelectedAttribute('');
    setAttributeValue('');
  };

  const handleDeleteAttribute = (index) => {
    const updatedAttributes = [...newProduct.attributes];
    updatedAttributes.splice(index, 1);
    setNewProduct({
      ...newProduct,
      attributes: updatedAttributes
    });
  };

  const handleAddProduct = async () => {
    console.log("this is newProduct", newProduct);
    if (!newProduct.name || !newProduct.category || !newProduct.base_price) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Validate that at least one image is provided
    if (!newProduct.images || newProduct.images.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please upload at least one product image',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Handle multiple images (File objects)
      newProduct.images.forEach((file, index) => {
        if (file instanceof File) {
          formData.append('images[]', file);
        }
      });

      // Append other fields (exclude images and previewImages)
      for (const key in newProduct) {
        if (key === 'images' || key === 'previewImages') {
          continue; // Skip as they are handled above or not needed
        }
        if (key === 'pricing_levels' || key === 'attributes') {
          formData.append(key, JSON.stringify(newProduct[key]));
        } else if (newProduct[key] !== null && newProduct[key] !== undefined) {
          formData.append(key, newProduct[key]);
        }
      }

      // Optional: Log FormData for debugging
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }

      const response = await axios.post('/api/v1/products/add_product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProducts(prevProducts => [response.data, ...prevProducts]);
      setNewProduct(INITIAL_PRODUCT_STATE);
      setActiveTab(0);

      setSnackbar({
        open: true,
        message: 'Product saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save product. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Add Product
        return (
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AddProductForm
              product={newProduct}
              setProduct={setNewProduct}
            />
            <Box sx={{ textAlign: 'right', mt: 3 }}>
              <MotionButton
                variant="contained"
                color="primary"
                onClick={() => setActiveTab(1)}
                endIcon={<ArrowForwardIcon />}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                Next: Product Details
              </MotionButton>
            </Box>
          </MotionDiv>
        );
      case 1: // Product Details
        return (
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProductDetailsForm
              product={newProduct}
              setProduct={setNewProduct}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <MotionButton
                variant="outlined"
                color="secondary"
                onClick={() => setActiveTab(0)}
                startIcon={<ArrowBackIcon />}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px'
                  }
                }}
              >
                Back: Product Info
              </MotionButton>
              <MotionButton
                variant="contained"
                color="primary"
                onClick={() => setActiveTab(2)}
                endIcon={<ArrowForwardIcon />}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                Next: Pricing
              </MotionButton>
            </Box>
          </MotionDiv>
        );
      case 2: // Pricing
        return (
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Pricing Information</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure your product pricing, taxes, and discounts
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cost Price (₹)"
                      type="number"
                      value={newProduct.cost_price}
                      onChange={(e) => setNewProduct({...newProduct, cost_price: e.target.value})}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Base Selling Price (₹)"
                      type="number"
                      value={newProduct.base_price}
                      onChange={(e) => setNewProduct({...newProduct, base_price: e.target.value})}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>Level Pricing</Typography>
              
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell>Level</TableCell>
                      <TableCell>Price (₹)</TableCell>
                      <TableCell>Discount (%)</TableCell>
                      <TableCell>Final Price (₹)</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newProduct.pricing_levels.map((level, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            value={level.level}
                            onChange={(e) => {
                              const updatedLevels = [...newProduct.pricing_levels];
                              updatedLevels[index].level = e.target.value;
                              setNewProduct({...newProduct, pricing_levels: updatedLevels});
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={level.price}
                            onChange={(e) => {
                              const updatedLevels = [...newProduct.pricing_levels];
                              updatedLevels[index].price = e.target.value;
                              updatedLevels[index].final_price = calculateFinalPrice(
                                e.target.value, 
                                updatedLevels[index].discount
                              );
                              setNewProduct({...newProduct, pricing_levels: updatedLevels});
                            }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={level.discount}
                            onChange={(e) => {
                              const updatedLevels = [...newProduct.pricing_levels];
                              updatedLevels[index].discount = e.target.value;
                              updatedLevels[index].final_price = calculateFinalPrice(
                                updatedLevels[index].price, 
                                e.target.value
                              );
                              setNewProduct({...newProduct, pricing_levels: updatedLevels});
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {level.final_price ? `₹${parseFloat(level.final_price).toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="error"
                            onClick={() => handleDeletePricingLevel(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mb: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddPricingLevel}
                >
                  Add Pricing Level
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>GST Rate</InputLabel>
                    <Select
                      value={newProduct.tax_rate}
                      label="GST Rate"
                      onChange={(e) => setNewProduct({...newProduct, tax_rate: e.target.value})}
                    >
                      <MenuItem value="">Select GST rate</MenuItem>
                      <MenuItem value="0%">0%</MenuItem>
                      <MenuItem value="5%">5%</MenuItem>
                      <MenuItem value="12%">12%</MenuItem>
                      <MenuItem value="18%">18%</MenuItem>
                      <MenuItem value="28%">28%</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="HSN Code"
                    value={newProduct.hsn_code}
                    onChange={(e) => setNewProduct({...newProduct, hsn_code: e.target.value})}
                    placeholder="Enter HSN code"
                  />
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <MotionButton
                variant="outlined"
                color="secondary"
                onClick={() => setActiveTab(1)}
                startIcon={<ArrowBackIcon />}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px'
                  }
                }}
              >
                Back: Details
              </MotionButton>
              <MotionButton
                variant="contained"
                color="primary"
                onClick={() => setActiveTab(3)}
                endIcon={<ArrowForwardIcon />}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                Next: Attributes
              </MotionButton>
            </Box>
          </MotionDiv>
        );
      case 3: // Attributes
        return (
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Product Attributes</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add product variations, colors, sizes and other attributes
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Add Attribute</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Select Attribute</InputLabel>
                      <Select
                        value={selectedAttribute}
                        label="Select Attribute"
                        onChange={(e) => setSelectedAttribute(e.target.value)}
                      >
                        <MenuItem value="">Select an attribute</MenuItem>
                        <MenuItem value="Color">Color</MenuItem>
                        <MenuItem value="Size">Size</MenuItem>
                        <MenuItem value="Material">Material</MenuItem>
                        <MenuItem value="Weight">Weight</MenuItem>
                        <MenuItem value="Dimensions">Dimensions</MenuItem>
                        <MenuItem value="Capacity">Capacity</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Attribute Value"
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(e.target.value)}
                      placeholder="Comma separated values (e.g., Black, White, Blue)"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      onClick={handleAddAttribute}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Attributes List</Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell>Attribute</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newProduct.attributes.map((attr, index) => (
                      <TableRow key={index}>
                        <TableCell>{attr.name}</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={attr.value}
                            onChange={(e) => {
                              const updatedAttributes = [...newProduct.attributes];
                              updatedAttributes[index].value = e.target.value;
                              setNewProduct({
                                ...newProduct,
                                attributes: updatedAttributes
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="error"
                            onClick={() => handleDeleteAttribute(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {newProduct.attributes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No attributes added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <MotionButton
                variant="outlined"
                color="secondary"
                onClick={() => setActiveTab(2)}
                startIcon={<ArrowBackIcon />}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px'
                  }
                }}
              >
                Back: Pricing
              </MotionButton>
              <MotionButton
                variant="contained"
                color="success"
                onClick={handleAddProduct}
                endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: theme.shadows[6]
                }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                sx={{
                  borderRadius: '20px',
                  padding: '8px 24px',
                  boxShadow: theme.shadows[3],
                  background: `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  '&:hover': {
                    boxShadow: theme.shadows[6]
                  },
                  '&.Mui-disabled': {
                    background: theme.palette.action.disabledBackground
                  }
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </MotionButton>
            </Box>
          </MotionDiv>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4, 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: theme.palette.background.default
    }}>
      <GradientBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <HeaderText
            variant="h5"
            sx={{ 
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              fontSize: isMobile ? '1.2rem' : '1.5rem'
            }}
          >
            Inventory Management Dashboard
          </HeaderText>
          <SubtitleText variant="subtitle1">
            Add and manage your Inventory with ease
          </SubtitleText>
        </Stack>
      </GradientBox>

      <MotionPaper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            background: theme.palette.background.paper,
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <StyledTab
            icon={<PostAddIcon />}
            iconPosition="start"
            label={isMobile ? "Basic" : "Basic Info"}
          />
          <StyledTab
            icon={<InfoIcon />}
            iconPosition="start"
            label={isMobile ? "Details" : "Product Details"}
          />
          <StyledTab
            icon={<AttachMoneyIcon />}
            iconPosition="start"
            label={isMobile ? "Pricing" : "Pricing"}
          />
          <StyledTab
            icon={<ListAltIcon />}
            iconPosition="start"
            label={isMobile ? "Attributes" : "Attributes"}
          />
        </Tabs>

        <Box sx={{ 
          p: isMobile ? 2 : 3,
          background: theme.palette.background.paper,
          minHeight: '400px'
        }}>
          {renderTabContent()}
        </Box>
      </MotionPaper>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          '&:before, &:after': {
            content: '""',
            flex: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            margin: '0 10px'
          }
        }}>
          Your Products
        </Typography>
        <ProductList products={products} setProducts={setProducts} />
      </MotionDiv>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyModule;