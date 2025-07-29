import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Drawer,
  TextField,
  Button,
  Divider,
  Stack,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Upload as UploadIcon, Close as CloseIcon } from '@mui/icons-material';
import JsBarcode from 'jsbarcode';
import { QRCodeCanvas } from 'qrcode.react';

const ProductList = ({ products, setProducts }) => {
  // ── State for sidebar (Drawer) ──────────────────────────────────────────────
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const barcodeRef = useRef();

  // ── Track image states ─────────────────────────────────────────────────────
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]); // Track deleted image paths
  const [barcodeValue, setBarcodeValue] = useState('');

  // ── Generate barcode only when barcodeValue changes ────────────────────────
  useEffect(() => {
    if (barcodeRef.current && barcodeValue) {
      try {
        while (barcodeRef.current.firstChild) {
          barcodeRef.current.removeChild(barcodeRef.current.firstChild);
        }
        JsBarcode(barcodeRef.current, barcodeValue, {
          format: "CODE128",
          displayValue: true,
          width: 2,
          height: 60,
        });
      } catch (error) {
        console.error("Barcode generation error:", error);
      }
    }
  }, [barcodeValue]);

  // ── Initialize barcode and images when product is selected ────────────────
  useEffect(() => {
    if (selectedProduct) {
      // Initialize preview URLs with existing images
      const existingImageUrls = selectedProduct.images?.length > 0
        ? selectedProduct.images.map(image => `/storage/${image}`)
        : selectedProduct.image
          ? [`/storage/${selectedProduct.image}`]
          : ['/placeholder-product.png'];

      // Combine existing images with new ones (if any)
      const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...existingImageUrls, ...newImageUrls]);

      // Set initial barcode value
      const initialBarcode = selectedProduct.barcode ||
        `PROD-${selectedProduct.id || ''}-${selectedProduct.sku || ''}`;
      setBarcodeValue(initialBarcode);

      // Update product if barcode was generated
      if (!selectedProduct.barcode) {
        setSelectedProduct(prev => ({
          ...prev,
          barcode: initialBarcode,
        }));
      }
    } else {
      setPreviewUrls([]);
      setNewImageFiles([]);
      setDeletedImages([]);
      setBarcodeValue('');
    }
  }, [selectedProduct]);

  // ── User clicks "Edit" icon ────────────────────────────────────────────────
  const handleEditClick = (product, index) => {
    setSelectedProduct({ ...product, _idx: index });
    setNewImageFiles([]);
    setDeletedImages([]);
    setSidebarOpen(true);
  };

  const handleDelete = async (id, index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/v1/products/delete/${id}`);
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // ── Track changes to text fields ───────────────────────────────────────────
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'barcode') {
      setBarcodeValue(value);
    }
  };

  // ── Handle new image selection ─────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImageFiles(prev => [...prev, ...files]);
      setPreviewUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };

  // ── Handle image deletion ──────────────────────────────────────────────────
  const handleDeleteImage = (index, url) => {
    if (url.startsWith('/storage/')) {
      // Existing image from backend
      const imagePath = url.replace('/storage/', '');
      setDeletedImages(prev => [...prev, imagePath]);
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      // New image (local file)
      setNewImageFiles(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const downloadBarcode = () => {
    if (!barcodeRef.current) return;

    const svg = barcodeRef.current;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${selectedProduct.sku || selectedProduct.id || 'product'}.svg`;
    link.click();
  };

  const downloadQR = () => {
    const canvas = document.querySelector("#qr-canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${selectedProduct.sku || selectedProduct.id || 'product'}.png`;
      link.click();
    }
  };

  // ── When "Save" is clicked ────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!selectedProduct) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      const { id, _idx, ...fields } = selectedProduct;

      // Append text fields
      Object.entries(fields).forEach(([key, val]) => {
        if (key === 'images') return;
        formData.append(key, val ?? '');
      });

      // Append new images
      newImageFiles.forEach(file => {
        formData.append('images[]', file);
      });

      // Append deleted images
      if (deletedImages.length > 0) {
        formData.append('deletedImages', JSON.stringify(deletedImages));
      }

      formData.append('_method', 'PUT');

      const response = await axios.post(`/api/v1/products/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedProducts = [...products];
      updatedProducts[_idx] = response.data;
      setProducts(updatedProducts);

      setSidebarOpen(false);
      setSelectedProduct(null);
      setNewImageFiles([]);
      setDeletedImages([]);
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>

      {products.length === 0 ? (
        <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
          No products added yet.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Images</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id || index}>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {product.images?.length > 0 ? (
                        product.images.map((image, imgIndex) => (
                          <Avatar
                            key={imgIndex}
                            src={`/storage/${image}`}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                        ))
                      ) : product.image ? (
                        <Avatar
                          src={`/storage/${product.image}`}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <Avatar
                          src="/placeholder-product.png"
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(product.description || '').substring(0, 50)}...
                    </Typography>
                  </TableCell>

                  <TableCell>${product.base_price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(product, index)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product.id, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setSelectedProduct(null);
          setNewImageFiles([]);
          setDeletedImages([]);
        }}
        PaperProps={{
          sx: {
            width: { xs: 320, sm: 600 },
            p: 3,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            bgcolor: 'background.paper',
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Product
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {selectedProduct && (
          <Stack spacing={2}>
            {/* Image Preview & Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                {previewUrls.map((url, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Avatar
                      src={url}
                      variant="rounded"
                      sx={{ width: 64, height: 64 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteImage(index, url)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'white',
                        boxShadow: 1,
                        '&:hover': { bgcolor: '#f5f5f5' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadIcon />}
                sx={{ textTransform: 'none' }}
              >
                Add Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                {newImageFiles.length > 0
                  ? `${newImageFiles.length} new image(s) selected`
                  : previewUrls.length > 0
                    ? 'Current images preview'
                    : 'No images selected'}
              </Typography>
            </Box>

            <Divider />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={selectedProduct.name}
                  onChange={handleFieldChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  minRows={2}
                  value={selectedProduct.description || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  name="base_price"
                  type="number"
                  fullWidth
                  value={selectedProduct.base_price}
                  onChange={handleFieldChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  name="category"
                  fullWidth
                  value={selectedProduct.category || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  fullWidth
                  value={selectedProduct.stock}
                  onChange={handleFieldChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="SKU"
                  name="sku"
                  fullWidth
                  value={selectedProduct.sku || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Weight"
                  name="weight"
                  fullWidth
                  value={selectedProduct.weight || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dimensions"
                  name="dimensions"
                  fullWidth
                  value={selectedProduct.dimensions || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="HSN Code"
                  name="hsn_code"
                  fullWidth
                  value={selectedProduct.hsn_code || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Barcode"
                  name="barcode"
                  fullWidth
                  value={selectedProduct.barcode || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              {/* Barcode and QR Code Preview */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Barcode & QR Code:
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Barcode
                      </Typography>
                      <svg ref={barcodeRef} style={{ maxWidth: '100%', height: '60px' }} />
                      <Button
                        variant="outlined"
                        onClick={downloadBarcode}
                        sx={{ mt: 1 }}
                        size="small"
                      >
                        Download
                      </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        QR Code
                      </Typography>
                      <QRCodeCanvas
                        id="qr-canvas"
                        value={barcodeValue}
                        size={100}
                      />
                      <Button
                        variant="outlined"
                        onClick={downloadQR}
                        sx={{ mt: 1 }}
                        size="small"
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Unit"
                  name="unit"
                  fullWidth
                  value={selectedProduct.unit || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Status"
                  name="status"
                  fullWidth
                  value={selectedProduct.status || ''}
                  onChange={handleFieldChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Condition"
                  name="condition"
                  fullWidth
                  value={selectedProduct.condition || ''}
                  onChange={handleFieldChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setSidebarOpen(false);
                  setSelectedProduct(null);
                  setNewImageFiles([]);
                  setDeletedImages([]);
                }}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
};

export default ProductList;