import React from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip
} from "@mui/material";
import { AttachFile, Close } from "@mui/icons-material";

const AddProductForm = ({ product, setProduct }) => {
  // Handle multiple image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = [];
    const newPreviews = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        newImages.push(file);
        
        // Update state when all files are processed
        if (newPreviews.length === files.length) {
          setProduct(prev => ({
            ...prev,
            images: [...(prev.images || []), ...newImages],
            previewImages: [...(prev.previewImages || []), ...newPreviews]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove an image
  const removeImage = (index) => {
    setProduct(prev => {
      const newImages = [...(prev.images || [])];
      const newPreviews = [...(prev.previewImages || [])];
      
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      
      return {
        ...prev,
        images: newImages,
        previewImages: newPreviews
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Books',
    'Beauty'
  ];

  const productTypes = [
    'Physical Product',
    'Service',
    'Digital Product'
  ];
  const barcodeTypes = [
    'EAN-13',
    'UPC-A',
    'Code 128',
    'QR Code',
    'Data Matrix',
    'PDF417',
    'ITF-14',
    'EAN-8',
    'Code 39'
  ];

  // Safely get preview images array
  const previewImages = product.previewImages || [];
  const images = product.images || [];

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "2rem auto",
        padding: 3,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "700", color: "#222", letterSpacing: 0.5 }}
      >
        Add New Product
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            minWidth: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1
          }}
        >
          {/* Image Previews */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            maxHeight: 120,
            overflowY: 'auto',
            justifyContent: 'center'
          }}>
            {previewImages.length > 0 ? (
              previewImages.map((preview, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      border: "1.5px solid #ddd",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fafafa",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'white',
                      boxShadow: 1,
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      width: 24,
                      height: 24,
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Avatar
                src="/placeholder-product.png"
                variant="rounded"
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 3,
                  border: "1.5px solid #ddd",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fafafa",
                }}
              />
            )}
          </Box>

          {/* Upload Button */}
          <Button
            variant="outlined"
            component="label"
            size="small"
            startIcon={<AttachFile fontSize="small" />}
            sx={{
              width: "100%",
              fontSize: "0.8rem",
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            {images.length > 0 
              ? `Add Images (${images.length})` 
              : 'Upload Images'}
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          
          {images.length > 0 && (
            <Chip 
              label={`${images.length} image${images.length > 1 ? 's' : ''} selected`} 
              size="small" 
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          <TextField
            label="Product Name"
            name="name"
            placeholder="Enter product name"
            value={product.name || ''}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="SKU"
              name="sku"
              placeholder="SKU code"
              value={product.sku || ''}
              onChange={handleChange}
              size="small"
              sx={{
                flex: "1 1 45%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
              required
            />
            <TextField
              label="HSN Code"
              name="hsn_code"
              placeholder="HSN code"
              value={product.hsn_code || ''}
              onChange={handleChange}
              size="small"
              sx={{
                flex: "1 1 45%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
            />
          </Box>

          <TextField
            select
            label="Barcode Type"
            name="barcodeType"
            value={product.barcodeType || ''}
            onChange={handleChange}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
              },
            }}
          >
            {barcodeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>


          <TextField
            select
            label="Category"
            name="category"
            value={product.category || ''}
            onChange={handleChange}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
              },
            }}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <FormControl fullWidth size="small">
            <InputLabel>Product Type</InputLabel>
            <Select
              name="productType"
              value={product.productType || ''}
              onChange={handleChange}
              label="Product Type"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
            >
              {productTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Unit"
              name="unit"
              placeholder="e.g. Piece"
              value={product.unit || ''}
              onChange={handleChange}
              size="small"
              sx={{
                flex: "1 1 45%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
              required
            />

            <FormControl
              size="small"
              required
              sx={{
                flex: "1 1 45%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={product.status || ''}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Condition"
              name="condition"
              placeholder="New / Used"
              value={product.condition || ''}
              onChange={handleChange}
              size="small"
              sx={{
                flex: "1 1 45%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
            />
            <TextField
              label="Brand"
              name="brand"
              placeholder="e.g. Nike"
              value={product.brand || ''}
              onChange={handleChange}
              size="small"
              sx={{
                flex: "1 1 45%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
              required
            />
          </Box>     
        </Box>
      </Box>
    </Box>
  );
};

export default AddProductForm;