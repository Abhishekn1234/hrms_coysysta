import { useState, useEffect, useRef } from 'react';
import React from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
import axios from 'axios';
// const sampleCustomers = [
//   { id: 1, name: 'Acme Corp', contactPerson: 'John Doe', type: 'Corporate' },
//   { id: 2, name: 'Beta Ltd', contactPerson: 'Jane Smith', type: 'Existing' },
//   { id: 3, name: 'Gamma Inc', contactPerson: 'Mike Johnson', type: 'New' },
// ];

 

  // fetchClientCustomers();

  // console.log("fetched client data",sampleCustomers);

  // const sampleProducts = [
  //     { id: 1, name: 'Sample Item 1', sku: 'S001', category: 'Group A', unit: 'pcs', worth: 100, stock: 10 },
  //     { id: 2, name: 'Sample Item 2', sku: 'S002', category: 'Group B', unit: 'kg', worth: 200, stock: 5 },
  //     // more...
  //   ];
 




const InventoryTable = ({
  data,
  expandedCategories,
  expandedItems,
  toggleCategory,
  toggleItem,
  onDataChange,
  dataforSearch
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryData, setInventoryData] = useState(data);
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempCategoryName, setTempCategoryName] = useState('');
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  const lastFocusedElement = useRef(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [selectedCustomer1, setSelectedCustomer1] = useState(null);
  const pendingSubItemsRef = useRef(null);
  const [customerSearchTerm, setcustomerSearchTerm] = useState('');
  const handleCustomerSelect1 = (customer) => {
    setSelectedCustomer1(customer);
    // You can also populate other state fields here
    console.log("Selected customer:", customer);
  };
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const fetchClientCustomers = async () => {
      try {
        const response = await axios.get('/api/v1/crm/leads', {
          params: { status: 'client' }
        });
        console.log("this is customers data", response);
        const transformed = response.data.map(lead => ({
          id: lead.id,
          name: lead.company,
          contactPerson: lead.name,
          type: lead.status
        }));
        
        
        setCustomers(transformed);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    
    fetchClientCustomers();
  }, []);
  const [products, setProducts] = useState([]);
      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get('/api/v1/products/list', {
              params: { status: 'client' }
            });
            
            const transformed = response.data.map(product => ({
              id: product.id,
              name: product.name,
              sku: product.sku,
              category: product.category,
              unit: product.unit,
              worth: product.base_price ?? product.cost_price ?? 0,
              stock: product.stock ?? 0
            }));

            setProducts(transformed);
          } catch (error) {
            console.error('Error fetching products, using sample data.', error);
            setProducts(sampleProducts);
          }
        };

        fetchProducts();
      }, []);
      const sampleProducts=products;
      // console.log("this is the new 11 product",products);

     const handleApplySampleProductToSubItem = (categoryName, itemId, subItemId, product) => {
      setInventoryData((prevData) => ({
        ...prevData,
        categories: prevData.categories.map((category) => {
          if (category.name !== categoryName) return category;
          return {
            ...category,
            items: category.items.map((item) => {
              if (item.id !== itemId) return item;
              return {
                ...item,
                subItems: item.subItems.map((subItem) => {
                  if (subItem.id !== subItemId) return subItem;
                  return {
                    ...subItem,
                    name: product.name,
                    sku: product.sku || '',
                    category: product.category || categoryName,
                    stock: product.stock ?? 0,
                    unit: product.unit || 'Piece',
                    worth: product.worth ?? 0,
                    status: 'Active',
                  };
                }),
              };
            }),
          };
        }),
      }));
    };
  // const filteredCustomers = customers.filter(c =>
  //   c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredCustomers = customers.filter(customer => {
    const values = Object.values(customer).join(' ').toLowerCase();
    return values.includes(searchTerm.toLowerCase());
  });


  // Process search data
  dataforSearch = dataforSearch.products;

  console.log("this is data for search",dataforSearch);

  // const filteredProducts = (dataforSearch || []).flatMap(group => group.items || []).filter(product =>
  //   product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  // );
 console.log("this is term for search",searchTerm);

  const flattened = (dataforSearch || []).flatMap(group => {
  if (!group || !Array.isArray(group.items)) {
    console.warn("Invalid group or items:", group);
    return [];
  }
  return group.items;
});

console.log("Flattened items:", flattened);

  const filteredProducts = (dataforSearch || [])
  .flatMap(group => Array.isArray(group.items) ? group.items : [])
  .filter(product =>
    product && typeof product.name === 'string' &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Modal setup
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current, { focus: true });

      modalRef.current.addEventListener('hidden.bs.modal', () => {
        setSelectedItem(null);
        setActiveTab('basic');
        lastFocusedElement.current?.focus();
      });

      modalRef.current.addEventListener('shown.bs.modal', () => {
        const closeButton = modalRef.current.querySelector('.btn-close');
        if (closeButton) closeButton.focus();
      });
    }

    return () => {
      if (bsModal.current) {
        bsModal.current.dispose();
      }
    };
  }, []);

  // Modal visibility control
  useEffect(() => {
    if (selectedItem && bsModal.current) {
      lastFocusedElement.current = document.activeElement;
      bsModal.current.show();
      modalRef.current.removeAttribute('aria-hidden');
      modalRef.current.setAttribute('aria-modal', 'true');
    } else if (bsModal.current) {
      bsModal.current.hide();
    }
  }, [selectedItem]);

  // Accessibility: Tab key trapping in modal
  useEffect(() => {
    const handleTabKey = (e) => {
      if (!selectedItem || !modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (selectedItem) {
      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [selectedItem]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      bsModal.current.hide();
    }
  };

  // Product selection from search
  const handleSelectProduct = (product) => {

    console.log("this is selected product",product );
    setSearchTerm(product.name);
    const mappedProduct = {
      id: product.id,
      name: product.name,
      sku: product.hsn_code || '',
      category: product.stock_category || '',
      stock: product.stock_count || 0,
      minStock: 5,
      unit: product.unit || 'Piece',
      worth: product.worth || 0,
      status: 'Active',
      subItems: product.subItems || []
    };
    setSelectedProduct(mappedProduct);
    setShowDropdown(false);

    console.log("this is mapped products", mappedProduct);
    handleAddProduct(mappedProduct);
  };

  // Add new category
  const handleAddCategory = () => {
    const newCategoryName = 'New Inventory';
    
    setInventoryData(prevData => {
      const categoryExists = prevData.categories.some(cat => cat.name === newCategoryName);
      
      if (categoryExists) {
        return prevData;
      } else {
        return {
          categories: [
            ...prevData.categories,
            {
              name: newCategoryName,
              items: []
            }
          ]
        };
      }
    });

    if (!expandedCategories.includes(newCategoryName)) {
      toggleCategory(newCategoryName);
    }
  };

  // Add new product
  const handleAddProduct = (selectedProduct = null) => {
    if (!selectedProduct) {
      // If no product selected, just add a new category
      handleAddCategory();
      return;
    }

    const newCategoryName = selectedProduct?.category || 'New Inventory';
    const productData = {
      id: selectedProduct.id || Date.now(),
      name: selectedProduct.name || selectedProduct.item_name || 'New Product',
      sku: selectedProduct.sku || selectedProduct.hsn_code || '',
      category: newCategoryName,
      stock: selectedProduct.stock || selectedProduct.stock_count || 0,
      minStock: selectedProduct.minStock || 5,
      unit: selectedProduct.unit || 'Piece',
      worth: selectedProduct.worth || 0,
      status: selectedProduct.status || 'Active',
      subItems: selectedProduct.subItems || []
    };

    setInventoryData(prevData => {
      const categoryExists = prevData.categories.some(cat => cat.name === newCategoryName);
      
      if (categoryExists) {
        return {
          categories: prevData.categories.map(cat => 
            cat.name === newCategoryName
              ? { ...cat, items: [...cat.items, productData] }
              : cat
          )
        };
      } else {
        return {
          categories: [
            ...prevData.categories,
            {
              name: newCategoryName,
              items: [productData]
            }
          ]
        };
      }
    });

    if (!expandedCategories.includes(newCategoryName)) {
      toggleCategory(newCategoryName);
    }

    if (selectedProduct?.subItems?.length > 0) {
      pendingSubItemsRef.current = {
        categoryName: newCategoryName,
        itemId: productData.id,
        subItems: selectedProduct.subItems
      };
    }
  };

  // Add subitem
  const handleAddSubItem = (categoryName, itemId, subItemData = null) => {
    setInventoryData(prevData => {
      return {
        categories: prevData.categories.map(category => {
          if (category.name !== categoryName) return category;
          
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id !== itemId) return item;
              
              const newSubItem = {
                id: Date.now(),
                name: subItemData?.name || `Subitem ${(item.subItems?.length || 0) + 1}`,
                sku: subItemData?.sku || '',
                category: subItemData?.category || item.category,
                stock: subItemData?.stock || 0,
                minStock: subItemData?.minStock || 5,
                unit: subItemData?.unit || item.unit,
                worth: subItemData?.worth || 0,
                status: subItemData?.status || 'Active'
              };
              
              return {
                ...item,
                subItems: [...(item.subItems || []), newSubItem]
              };
            })
          };
        })
      };
    });

    if (!expandedItems.includes(itemId)) {
      toggleItem(itemId);
    }
  };

  // Process pending subitems
  useEffect(() => {
    if (pendingSubItemsRef.current) {
      const { categoryName, itemId, subItems } = pendingSubItemsRef.current;
      
      subItems.forEach(subItem => {
        handleAddSubItem(categoryName, itemId, subItem);
      });

      pendingSubItemsRef.current = null;
    }
  }, [inventoryData]);

  // Save all changes
  const handleSaveAll = async () => {
    setSaveMessage('');

    try {
      console.log("this is customer id ",selectedCustomer1 );
         const payload = {
            ...inventoryData,
            customerId: selectedCustomer1 ? selectedCustomer1.id : null
          };
      const response = await fetch('/api/v1/inventories/saveinventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save inventory');
      }

      const result = await response.json();
      onDataChange(result);

      setMessageType('success');
      setSaveMessage('All changes saved successfully!');
      setTimeout(() => {
        setSaveMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Save Error:', error);
      setMessageType('error');
      setSaveMessage('Failed to save data. Please try again.');
      setTimeout(() => {
        setSaveMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  // Delete item
  const handleDeleteItem = (categoryName, itemId) => {
    let updatedCategories = inventoryData.categories.map(category => {
      if (category.name !== categoryName) return category;
      return {
        ...category,
        items: category.items.filter(item => item.id !== itemId)
      };
    });

    updatedCategories = updatedCategories.filter(category => category.items.length > 0);

    setInventoryData({
      categories: updatedCategories
    });
  };

  // Delete subitem
  const handleDeleteSubItem = (categoryName, parentItemId, subItemId) => {
    let updatedCategories = inventoryData.categories.map(category => {
      if (category.name !== categoryName) return category;
      return {
        ...category,
        items: category.items.map(item => {
          if (item.id !== parentItemId) return item;
          return {
            ...item,
            subItems: item.subItems.filter(subItem => subItem.id !== subItemId)
          };
        })
      };
    });

    updatedCategories = updatedCategories.filter(category => category.items.length > 0);

    setInventoryData({
      categories: updatedCategories
    });
  };

  // Update item data
  const handleItemChange = (categoryName, itemId, field, value, isSubItem = false, subItemId = null) => {
    setInventoryData(prevData => {
      const updatedCategories = prevData.categories.map(category => {
        if (category.name !== categoryName) return category;
        
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id !== itemId) return item;
            
            if (isSubItem) {
              return {
                ...item,
                subItems: item.subItems.map(subItem => {
                  if (subItem.id !== subItemId) return subItem;
                  return { ...subItem, [field]: value };
                })
              };
            } else {
              return { ...item, [field]: value };
            }
          })
        };
      });
      
      return { categories: updatedCategories };
    });
  };

  // Category editing
  const startEditingCategory = (categoryName) => {
    setEditingCategory(categoryName);
    setTempCategoryName(categoryName);
  };

  const handleCategoryChange = (e) => {
    setTempCategoryName(e.target.value);
  };

  const saveCategoryName = (oldName) => {
    if (tempCategoryName.trim() === '') {
      setEditingCategory(null);
      return;
    }

    const updatedData = {
      categories: inventoryData.categories.map(category => {
        if (category.name !== oldName) return category;
        return {
          ...category,
          name: tempCategoryName,
          items: category.items.map(item => ({
            ...item,
            category: tempCategoryName,
            subItems: (item.subItems || []).map(subItem => ({
              ...subItem,
              category: tempCategoryName
            }))
          }))
        };
      })
    };

    setInventoryData(updatedData);
    setEditingCategory(null);
  };

  const handleCategoryKeyDown = (e, oldName) => {
    if (e.key === 'Enter') {
      saveCategoryName(oldName);
    } else if (e.key === 'Escape') {
      setEditingCategory(null);
    }
  };

  // Add item to category
  const handleAddItem = (categoryName) => {
    const newItem = {
      id: Date.now(),
      name: '',
      sku: '',
      category: categoryName,
      stock: 0,
      minStock: 5,
      unit: 'Piece',
      worth: 0,
      status: 'Active',
      subItems: []
    };

    setInventoryData(prevData => {
      const updatedCategories = prevData.categories.map(cat => {
        if (cat.name !== categoryName) return cat;
        return {
          ...cat,
          items: [...cat.items, newItem]
        };
      });
      return { categories: updatedCategories };
    });
  };

  // Function to update a field in the selectedItem
  const updateField = (field, value) => {
    setSelectedItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Special function for updating dimensions
  const updateDimensions = (dimension, value) => {
    setSelectedItem(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  // Function to handle save changes
  const handleSaveChanges = () => {
    // Implement your save logic here
    console.log('Saving changes:', selectedItem);
    // Then close the modal or show success message
  };

  if (!inventoryData || !inventoryData.categories) return null;

  return (
    <>
      <div className="d-flex align-items-center" style={{ position: 'relative', width: '100%' }}>
        {/* <input
          type="text"
          className="form-control w-50"
          placeholder="Search Categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => { if (filteredProducts.length) setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} 
        /> */}
        <button className="btn btn-primary ms-2" onClick={handleAddCategory}>
          <i className="bi bi-plus-lg me-1"></i> Add New Inventory
        </button>
       <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDropdown1(prev => !prev)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f8f9fa",
              cursor: "pointer",
            }}
          >
           {selectedCustomer1 ? `${selectedCustomer1.name} ▾` : 'Select Customer ▾'}
          </button>

         {showDropdown1 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "240px",
                background: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: "4px",
                zIndex: 10,
                marginTop: "4px",
              }}
            >
              {/* Search Input */}
              <div style={{ padding: "8px" }}>
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              {/* Filtered Customer List */}
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => {
                      handleCustomerSelect1(customer);
                      setShowDropdown1(false);
                      setSearchTerm(''); // optional: reset search
                    }}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f1f1f1")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <strong>{customer.name}</strong>
                    <br />
                    <small>
                      {customer.contactPerson} • {customer.type}
                    </small>
                  </div>
                ))
              ) : (
                <div style={{ padding: "10px", color: "#999" }}>No matching customers</div>
              )}
            </div>
          )}

        </div>


        {showDropdown && filteredProducts.length > 0 && (
          <ul
            className="list-group"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            {filteredProducts.map(product => (
              <li
                key={product.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: 'pointer' }}
                onMouseDown={() => handleSelectProduct(product)}
              >
                {product.name}
                {product.subItems && product.subItems.length > 0 && (
                  <span className="badge bg-secondary ms-2">{product.subItems.length} subitems</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="table-responsive">
        <table className="table tree-table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Name *</th>
              <th>SKU</th>
              <th>Category *</th>
              <th>Stock</th>
              <th>Unit *</th>
              <th>Worth (₹)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.categories.map((category) => (
              <React.Fragment key={category.name}>
                <tr className="category-row">
                  <td colSpan="8" className="bg-light fw-bold">
                    <div className="d-flex align-items-center">
                      <span
                        className="toggle-icon me-2"
                        onClick={() => toggleCategory(category.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={`bi bi-chevron-${expandedCategories.includes(category.name) ? 'down' : 'right'}`}></i>
                      </span>
                      
                      {editingCategory === category.name ? (
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control form-control-sm d-inline-block me-2"
                            value={tempCategoryName}
                            onChange={handleCategoryChange}
                            onKeyDown={(e) => handleCategoryKeyDown(e, category.name)}
                            autoFocus
                          />
                          <button 
                            className="btn btn-sm btn-success me-1"
                            onClick={() => saveCategoryName(category.name)}
                          >
                            <i className="bi bi-check"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingCategory(null)}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <span>{category.name}</span>
                          <button 
                            className="btn btn-sm btn-link ms-2"
                            onClick={() => startEditingCategory(category.name)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleAddItem(category.name)}
                      title="Add Product"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </td>
                </tr>

                {expandedCategories.includes(category.name) &&
                  category.items
                    .filter((item) => (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item,itemIndex) => (
                      <React.Fragment key={item.id}>
                      <tr style={{
                            margin: '8px',
                            padding: '12px',
                            borderRadius: '6px',
                            backgroundColor: '#f5f5f5',
                            boxShadow: '0 0 15px 5px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #ccc'
                          }}>
                            <td colSpan="100%" style={{
                              fontWeight: 'bold',
                              fontSize: '16px',
                              color: '#007bff'
                            }}>
                                {itemIndex+1}*
                            </td>
                          </tr>
                        <tr className="main-item" style={{
                          margin: '8px',
                          padding: '12px',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          boxShadow: '0 0 15px 5px rgba(0, 0, 0, 0.12)',
                          border: '1px solid #e0e0e0',
                        }}>
                          <td>
                            <span
                              className="toggle-icon me-2"
                              onClick={() => toggleItem(item.id)}
                              style={{ cursor: 'pointer' }}
                            >
                             {item.subItems?.length > 0
                              ? expandedItems.includes(item.id)
                                ? '▼'
                                : '▶'
                              : ''}
                            </span>
                            <input 
                              type="text" 
                              className="form-control form-control-sm d-inline w-100" 
                              value={item.name} 
                              onChange={(e) => handleItemChange(category.name, item.id, 'name', e.target.value)} 
                              required 
                            />
                          </td>
                          <td>
                            {/* <input 
                              type="text" 
                              className="form-control form-control-sm" 
                              value={item.sku} 
                              onChange={(e) => handleItemChange(category.name, item.id, 'sku', e.target.value)} 
                            /> */}
                          </td>
                          <td>
                            {/* <select 
                              className="form-select form-select-sm" 
                              value={item.category} 
                              onChange={(e) => {
                                handleItemChange(category.name, item.id, 'category', e.target.value);
                                if (item.subItems.length > 0) {
                                  setInventoryData(prevData => {
                                    const updatedCategories = prevData.categories.map(cat => {
                                      if (cat.name !== category.name) return cat;
                                      return {
                                        ...cat,
                                        items: cat.items.map(it => {
                                          if (it.id !== item.id) return it;
                                          return {
                                            ...it,
                                            subItems: it.subItems.map(sub => ({
                                              ...sub,
                                              category: e.target.value
                                            }))
                                          };
                                        })
                                      };
                                    });
                                    return { categories: updatedCategories };
                                  });
                                }
                              }} 
                              required
                            >
                              {inventoryData.categories.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                              ))}
                            </select> */}
                          </td>
                          <td>
                            {/* <input 
                              type="number" 
                              className="form-control form-control-sm" 
                              value={item.stock} 
                              onChange={(e) => handleItemChange(category.name, item.id, 'stock', parseInt(e.target.value))} 
                              min="0" 
                            />
                            <small className={`d-block ${item.stock < item.minStock ? 'text-danger fw-bold' : 'text-muted'}`}>
                              {item.stock < item.minStock ? 'Low stock!' : `Min: ${item.minStock}`}
                            </small> */}
                          </td>
                          <td>
                            {/* <select 
                              className="form-select form-select-sm" 
                              value={item.unit} 
                              onChange={(e) => handleItemChange(category.name, item.id, 'unit', e.target.value)} 
                              required
                            >
                              <option>Piece</option>
                              <option>Set</option>
                              <option>Kg</option>
                              <option>Liter</option>
                            </select> */}
                          </td>
                          <td>
                            {/* <input 
                              type="number" 
                              className="form-control form-control-sm" 
                              value={item.worth} 
                              onChange={(e) => handleItemChange(category.name, item.id, 'worth', parseFloat(e.target.value))} 
                            /> */}
                          </td>
                          <td>
                            <select 
                              className="form-select form-select-sm" 
                              value={item.status} 
                              onChange={(e) => handleItemChange(category.name, item.id, 'status', e.target.value)}
                            >
                              <option>Active</option>
                              <option>Inactive</option>
                            </select>
                          </td>
                          <td>
                            {/* <button className="btn btn-sm btn-info action-btn me-1" onClick={() => setSelectedItem(item)}>
                              <i className="bi bi-info-circle"></i>
                            </button> */}
                            <button 
                              className="btn btn-sm btn-success action-btn me-1" 
                              onClick={() => handleAddSubItem(category.name, item.id)}
                              disabled={item.status === 'Inactive'}
                            >
                              <i className="bi bi-plus-lg"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger action-btn"
                              onClick={() => handleDeleteItem(category.name, item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>

                        {expandedItems.includes(item.id) && item.subItems.map(subItem => (
                          <tr className="level-1" key={subItem.id}>
                            {/* <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={subItem.name} 
                                onChange={(e) => handleItemChange(category.name, item.id, 'name', e.target.value, true, subItem.id)} 
                                required 
                              />
                            </td> */}
                         <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            list={`sample-list-${subItem.id}`}
                            value={subItem.name}
                            onChange={(e) => {
                              handleItemChange(category.name, item.id, 'name', e.target.value, true, subItem.id);
                              
                              // Immediately check for matching product
                              const matched = sampleProducts.find(
                                p => p.name.toLowerCase() === e.target.value.toLowerCase()
                              );
                              
                              if (matched) {
                                handleApplySampleProductToSubItem(category.name, item.id, subItem.id, matched);
                              }
                            }}
                            required
                          />
                          <datalist id={`sample-list-${subItem.id}`}>
                            {sampleProducts.map((product) => (
                              <option key={product.id} value={product.name} />
                            ))}
                          </datalist>
                        </td>

                            <td >
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={subItem.sku} 
                                onChange={(e) => handleItemChange(category.name, item.id, 'sku', e.target.value, true, subItem.id)} 
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={subItem.category} 
                                readOnly 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={subItem.stock} 
                                onChange={(e) => handleItemChange(category.name, item.id, 'stock', parseInt(e.target.value), true, subItem.id)} 
                                min="0" 
                              />
                            </td>
                            <td>
                              <select 
                                className="form-select form-select-sm" 
                                value={subItem.unit} 
                                onChange={(e) => handleItemChange(category.name, item.id, 'unit', e.target.value, true, subItem.id)} 
                                required
                              >
                                <option>Piece</option>
                                <option>Set</option>
                                <option>Kg</option>
                                <option>Liter</option>
                              </select>
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={subItem.worth} 
                                onChange={(e) => handleItemChange(category.name, item.id, 'worth', parseFloat(e.target.value), true, subItem.id)} 
                              />
                            </td>
                            <td>
                              <select 
                                className="form-select form-select-sm" 
                                value={subItem.status} 
                                onChange={(e) => handleItemChange(category.name, item.id, 'status', e.target.value, true, subItem.id)}
                              >
                                <option>Active</option>
                                <option>Inactive</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger action-btn"
                                onClick={() => handleDeleteSubItem(category.name, item.id, subItem.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                              <button className="btn btn-sm btn-info action-btn me-1" onClick={() => {
                                  const matchedProduct = sampleProducts.find(p => p.name.toLowerCase() === subItem.name.toLowerCase());
                                  setSelectedItem({ ...subItem, matchedProduct });
                                }}>
                              <i className="bi bi-info-circle"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="mb-3">
          <button className="btn btn-primary" onClick={handleSaveAll}>
            Save All Changes
          </button>
        </div>
        {saveMessage && (
          <div
            className={`mt-2 alert ${
              messageType === 'success' ? 'alert-success' : 'alert-danger'
            }`}
            role="alert"
          >
            {saveMessage}
          </div>
        )}
      </div>

      {/* Modal for product details */}
      
    
    <div
      className="modal fade"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="productDetailsLabel"
      aria-hidden="true"
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      {console.log('🟡 Inside modal:', selectedItem)}
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="productDetailsLabel">
              Product Details - {selectedItem?.matchedProduct?.name || selectedItem?.name || ''}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setSelectedItem(null)}
            ></button>
          </div>
          <div className="modal-body">
            <ul className="nav nav-tabs mb-4" id="detailsTab" role="tablist">
              {[
                { key: 'basic', label: 'Basic Info' },
                { key: 'stock', label: 'Stock & Pricing' },
                { key: 'specs', label: 'Specifications' },
                { key: 'vendor', label: 'Vendor Info' },
              ].map((tab) => (
                <li className="nav-item" role="presentation" key={tab.key}>
                  <button
                    className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                    id={`${tab.key}-tab`}
                    data-bs-toggle="tab"
                    data-bs-target={`#${tab.key}`}
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab(tab.key)}
                    aria-selected={activeTab === tab.key}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content" id="detailsTabContent">
              {/* Basic Info */}
              <div className={`tab-pane fade ${activeTab === 'basic' ? 'show active' : ''}`} id="basic" role="tabpanel">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedItem?.matchedProduct?.name || selectedItem?.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">SKU *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedItem?.matchedProduct?.sku || selectedItem?.sku || ''}
                      onChange={(e) => updateField('sku', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">HSN Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedItem?.matchedProduct?.hsnCode || selectedItem?.hsnCode || ''}
                      onChange={(e) => updateField('hsnCode', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Barcode</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={selectedItem?.matchedProduct?.barcode || selectedItem?.barcode || ''}
                        onChange={(e) => updateField('barcode', e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="bi bi-upc-scan"></i>
                      </button>
                    </div>
                    {(selectedItem?.matchedProduct?.barcode || selectedItem?.barcode) && (
                      <div className="barcode-preview mt-2">
                        {selectedItem?.matchedProduct?.barcode || selectedItem?.barcode}
                      </div>
                    )}
                  </div>
                  {/* ...rest of fields populated directly from selectedItem... */}
                </div>
              </div>

              {/* Stock & Pricing */}
              <div className={`tab-pane fade ${activeTab === 'stock' ? 'show active' : ''}`} id="stock" role="tabpanel">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Current Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedItem?.matchedProduct?.stock || selectedItem?.stock || 0}
                      min="0"
                      onChange={(e) => updateField('stock', e.target.value)}
                    />
                  </div>
                  {/* ...rest of stock/pricing fields... */}
                </div>
              </div>

              {/* Specifications */}
              <div className={`tab-pane fade ${activeTab === 'specs' ? 'show active' : ''}`} id="specs" role="tabpanel">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedItem?.matchedProduct?.brand || selectedItem?.brand || ''}
                      onChange={(e) => updateField('brand', e.target.value)}
                    />
                  </div>
                  {/* ...rest of specs fields... */}
                </div>
              </div>

              {/* Vendor Info */}
              <div className={`tab-pane fade ${activeTab === 'vendor' ? 'show active' : ''}`} id="vendor" role="tabpanel">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Primary Vendor</label>
                    <select
                      className="form-select"
                      value={selectedItem?.matchedProduct?.vendor || selectedItem?.vendor || ''}
                      onChange={(e) => updateField('vendor', e.target.value)}
                    >
                      <option value="">Select Vendor</option>
                      <option value="Tech Suppliers Ltd.">Tech Suppliers Ltd.</option>
                      <option value="Global Electronics">Global Electronics</option>
                      <option value="Computer World">Computer World</option>
                    </select>
                  </div>
                  {/* ...rest of vendor fields... */}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default InventoryTable;