import React, { useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid
} from '@mui/material';
import JsBarcode from 'jsbarcode';
import { QRCodeCanvas } from 'qrcode.react';

const ProductDetailsForm = ({ product, setProduct, onSave }) => {
  const barcodeRef = useRef(null);
  const qrCodeRef = useRef(null); // To grab canvas

  // Automatically update barcode when SKU or ID changes
  useEffect(() => {
    if (product.sku || product.id) {
      const barcodeValue = `PROD-${product.id || ''}-${product.sku || ''}`;

      setProduct((prev) => ({
        ...prev,
        barcode: barcodeValue,
      }));

      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, barcodeValue, {
          format: "CODE128",
          displayValue: true,
          width: 2,
          height: 60,
        });
      }
    }
  }, [product.sku, product.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const downloadBarcode = () => {
    const svg = barcodeRef.current;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${product.sku || product.id || 'product'}.svg`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadQR = () => {
    const canvas = qrCodeRef.current?.querySelector("canvas");

    if (canvas) {
      const url = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${product.sku || product.id || 'product'}.png`;
      link.click();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6">Additional Details</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Category"
            name="category"
            value={product.category || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="SKU"
            name="sku"
            value={product.sku || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Stock Count"
            name="stock"
            type="number"
            value={product.stock || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={product.weight || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Dimensions (L x W x H)"
            name="dimensions"
            value={product.dimensions || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Barcode"
            name="barcode"
            value={product.barcode || ''}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {product.barcode && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">
            Barcode and QR Code Preview:
          </Typography>

          {/* Side by side view */}
          <Box
            sx={{ mt: 2, display:'flex', alignItems:'flex-start', gap:'40px' }}
          >
            {/* Barcode Section */}
            <Box>
              <svg ref={barcodeRef}></svg>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={downloadBarcode}>
                   Download Barcode
                </Button>
              </Box>
            </Box>

            {/* QR Code Section */}
            <Box ref={qrCodeRef}>
              <QRCodeCanvas value={product.barcode} size={128} />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={downloadQR}>
                   Download QR Code
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default ProductDetailsForm;
