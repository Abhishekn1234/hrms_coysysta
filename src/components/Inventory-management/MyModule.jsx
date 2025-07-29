import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Main from './Main';
import axios from 'axios';
import $ from 'jquery';


function AddProductModal({ show, onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    hsn: '',
    stock_category: '',
    unit: '',
    worth: '',
    vendor: '',
    sub_category: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (show) {
      setFormData({
        name: '',
        hsn: '',
        stock_category: '',
        unit: '',
        worth: '',
        vendor: '',
        sub_category: '',
      });
      setMessage('');
      setMessageType('');
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.post('/api/v1/inventories/inventory_save', formData);
      setMessage('Product saved successfully!');
      setMessageType('success');

      setTimeout(() => {
        onClose();
        if (onProductAdded) onProductAdded();
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage('Failed to save product. Please try again.');
      setMessageType('error');
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040, backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      ></div>

      <div className="modal d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: '400px' }}
        >
          <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">HSN Code</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="hsn"
                      value={formData.hsn}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock Category</label>
                    <select
                      className="form-control form-control-sm"
                      name="stock_category"
                      value={formData.stock_category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="machinery">Machinery</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Unit</label>
                    <select
                      className="form-control form-control-sm"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="">Select Unit</option>
                      <option value="piece">Piece</option>
                      <option value="set">Set</option>
                      <option value="kg">Kg</option>
                      <option value="litre">Litre</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Worth</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="worth"
                      value={formData.worth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Vendor</label>
                    <select
                      className="form-control form-control-sm"
                      name="vendor"
                      value={formData.vendor}
                      onChange={handleChange}
                    >
                      <option value="">Select Vendor</option>
                      <option value="vendorA">Vendor A</option>
                      <option value="vendorB">Vendor B</option>
                      <option value="vendorC">Vendor C</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Sub Category</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="sub_category"
                      value={formData.sub_category}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {message && (
                  <div
                    className={`alert alert-${messageType === 'success' ? 'success' : 'danger'} mt-3 py-1 mb-0`}
                    role="alert"
                  >
                    {message}
                  </div>
                )}
              </div>
              <div className="modal-footer py-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// function InventoryList({ products }) {
//   const getAllItemsRecursively = (items) => {
//     let allItems = [...items];
//     items.forEach(item => {
//       if (item.subItems && item.subItems.length > 0) {
//         allItems = allItems.concat(getAllItemsRecursively(item.subItems));
//       }
//     });
//     return allItems;
//   };

//   const allItems = [];
//   products.forEach(category => {
//     if (category.items) {
//       allItems.push(...getAllItemsRecursively(category.items));
//     }
//   });

//   return (
//     <div>
//       <h4>Inventory List</h4>
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>HSN</th>
//             <th>Worth</th>
//             <th>Stock</th>
//             <th>Min Stock</th>
//             <th>Vendor</th>
//           </tr>
//         </thead>
//         <tbody>
//           {allItems.map((item, index) => (
//             <tr key={index}>
//               <td>{item.name || 'N/A'}</td>
//               <td>{item.hsn || 'N/A'}</td>
//               <td>{item.worth || '0'}</td>
//               <td>{item.stock || '0'}</td>
//               <td>{item.minStock || '0'}</td>
//               <td>{item.vendor || 'N/A'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
function InventoryList({ products }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [editingGroup, setEditingGroup] = useState(null);
  const [editedData, setEditedData] = useState(null);


  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // const renderItems = (items, level = 0) => {
  //   return items.map((item, index) => {
  //     const isExpanded = expandedItems[item.id] || false;
  //     const hasChildren = item.subItems && item.subItems.length > 0;

  //     return (
  //       <React.Fragment key={item.id || index}>
  //         <div
  //           style={{
  //             marginLeft: `${level * 20}px`,
  //             padding: '12px',
  //             marginBottom: '8px',
  //             border: '1px solid #ccc',
  //             borderRadius: '10px',
  //             boxShadow: level === 0
  //               ? '0 2px 6px rgba(0,0,0,0.2)'
  //               : level === 1
  //               ? '0 1px 4px rgba(0,0,0,0.15)'
  //               : '0 1px 2px rgba(0,0,0,0.1)',
  //             backgroundColor: level === 0 ? '#fdfdfd' : level === 1 ? '#f8f9fa' : '#ffffff',
  //             fontSize: level === 0 ? '1rem' : level === 1 ? '0.95rem' : '0.9rem',
  //             cursor: hasChildren ? 'pointer' : 'default',
  //           }}
  //           onClick={() => hasChildren && toggleExpand(item.id)}
  //         >
  //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  //             <div>
  //               {hasChildren && (
  //                 <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
  //                   {isExpanded ? '▼' : '▶'}
  //                 </span>
  //               )}
  //               <strong>{item.name}</strong>
  //             </div>
  //             <div style={{ display: 'flex', gap: '20px' }}>
  //               <span>HSN: {item.hsn_code || 'N/A'}</span>
  //               <span>Worth: ₹{item.worth || '0'}</span>
  //               <span>Stock: {item.stock || '0'}</span>
  //               <span>Min: {item.minStock || '0'}</span>
  //               <span>Vendor: {item.vendor || 'N/A'}</span>
  //             </div>
  //           </div>
  //         </div>
  //         {hasChildren && isExpanded && renderItems(item.subItems, level + 1)}
  //       </React.Fragment>
  //     );
  //   });
  // };

  // return (
  //   <div className="p-4">
  //     <h4 className="mb-4">Inventory List</h4>
  //     {products.map((category, index) => (
  //       <div key={index} className="mb-5 inv_list">
  //         <h5 style={{ fontWeight: 'bold', color: '#007bff', marginBottom: '1rem' }}>{category.name}</h5>
  //         {category.items && renderItems(category.items)}
  //       </div>
  //     ))}
  //   </div>
  // );
  
const renderItems = (items, level = 0, parentPath = []) => {
  return items.map((item, index) => {
    const isExpanded = expandedItems[item.id] || false;
    const hasChildren = item.subItems && item.subItems.length > 0;

    const isEditing = editingGroup && item.category === editingGroup;
    const currentPath = [...parentPath, index];

    // const path = [...parentIndex, index];

    // const handleInputChange = (field, value) => {
    //   const newData = JSON.parse(JSON.stringify(editedData)); // deep copy
    //   let pointer = newData.items;

    //   for (let i = 0; i < path.length - 1; i++) {
    //     pointer = pointer[path[i]].subItems;
    //   }

    //   pointer[path[path.length - 1]][field] = value;
    //   setEditedData(newData);
    // };
    const handleInputChange = (field, value) => {
        const newData = JSON.parse(JSON.stringify(editedData));
        let pointer = newData.items;

        // Traverse using only indices
        for (let i = 0; i < currentPath.length - 1; i++) {
          const idx = currentPath[i];
          if (pointer[idx] && pointer[idx].subItems) {
            pointer = pointer[idx].subItems;
          } else {
            console.error('Path traversal error at index:', idx);
            return;
          }
        }

        const lastIndex = currentPath[currentPath.length - 1];
        if (pointer[lastIndex]) {
          pointer[lastIndex][field] = value;
        }

        setEditedData(newData);
      };


    return (
      <React.Fragment key={item.id || index}>
        <div
          style={{
            marginLeft: `${level * 20}px`,
            padding: '12px',
            marginBottom: '8px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow:
              level === 0
                ? '0 2px 6px rgba(0,0,0,0.2)'
                : level === 1
                ? '0 1px 4px rgba(0,0,0,0.15)'
                : '0 1px 2px rgba(0,0,0,0.1)',
            backgroundColor: level === 0 ? '#fdfdfd' : level === 1 ? '#f8f9fa' : '#ffffff',
            fontSize: level === 0 ? '1rem' : level === 1 ? '0.95rem' : '0.9rem',
            cursor: hasChildren ? 'pointer' : 'default',
          }}
          onClick={() => hasChildren && toggleExpand(item.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {hasChildren && (
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              )}
              <strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{ fontWeight: 'bold' }}
                  />
                ) : (
                  item.name
                )}
              </strong>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {isEditing ? (
                <>
                  <span>
                    HSN:{' '}
                    <input
                      type="text"
                      value={item.hsn_code}
                      onChange={(e) => handleInputChange('hsn_code', e.target.value)}
                    />
                  </span>
                  <span>
                    Worth: ₹
                    <input
                      type="number"
                      value={item.worth}
                      onChange={(e) => handleInputChange('worth', parseFloat(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </span>
                  <span>
                    Stock:{' '}
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </span>
                </>
              ) : (
                <>
                  <span>HSN: {item.hsn_code || 'N/A'}</span>
                  <span>Worth: ₹{item.worth || '0'}</span>
                  <span>Stock: {item.stock || '0'}</span>
                </>
              )}
              <span>Min: {item.minStock || '0'}</span>
              <span>Vendor: {item.vendor || 'N/A'}</span>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && renderItems(item.subItems, level + 1,currentPath)}
      </React.Fragment>
    );
  });
};

   const handleEditClick = (category) => {
      setEditingGroup(category.name);
      setEditedData(JSON.parse(JSON.stringify(category))); // Deep clone the object
    };

    const handleSave = async () => {
      try {
        // 🔁 Replace this with your real save endpoint
        console.log("edited data",editedData);
        await axios.put('/api/v1/inventories/new_update', editedData);
        alert('Saved successfully!');
        setEditingGroup(null);
        setEditedData({});
      } catch (err) {
        console.error(err);
        alert('Failed to save changes.');
      }
    };
    const handleCancel = () => {
      setEditingGroup(null);
      setEditedData(null);
    };

  
  
  return (
      <div className="p-4">
        <h4 className="mb-4">Inventory List</h4>
        {products.map((category, index) => (
          <div key={index} className="mb-5 inv_list">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h5 style={{ fontWeight: 'bold', color: '#007bff', marginBottom: '1rem' }}>{category.name}</h5>
              {!editingGroup || editingGroup !== category.name ? (
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(category)}>
                  Edit
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-success" onClick={handleSave}>
                    Save
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}

            </div>
            {category.items && renderItems(editingGroup === category.name ? editedData.items : category.items, 0, [])}
          </div>
        ))}
      </div>
    );

}
export default function InventoryManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('grouping');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchProducts = async () => {
    try {
      // const response = await axios.get('/api/v1/inventories/inventories');
      const response = await axios.get('http://localhost:8000/api/v1/inventories/inventories');

      console.log('data got', response.data.categories);
      setProducts(response.data.categories);
      console.log("this is products", response.data.categories);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    $('.js-navbar-vertical-aside-menu-link')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        const $li = $(this).closest('li');
        const $submenu = $(this).next('.js-navbar-vertical-aside-submenu');
        $li.toggleClass('active');
        $submenu.slideToggle(200);
      });
  }, []);

  const handleProductAdded = () => {
    fetchProducts();
  };

  const calculateInventoryStats = (products) => {
    let totalValue = 0;
    let totalCount = 0;
    let lowStockCount = 0;

    const calculateItemStats = (item) => {
      const stock = parseFloat(item.stock ?? 0);
      const worth = parseFloat(item.worth ?? 0);
      const minStock = parseFloat(item.minStock ?? 0);

      let itemValue = stock * worth;
      let itemCount = 1;
      let itemLowStockCount = stock < minStock ? 1 : 0;

      if (item.subItems && item.subItems.length > 0) {
        for (const subItem of item.subItems) {
          const { value, count, lowStock } = calculateItemStats(subItem);
          itemValue += value;
          itemCount += count;
          itemLowStockCount += lowStock;
        }
      }

      return { value: itemValue, count: itemCount, lowStock: itemLowStockCount };
    };

    for (const category of products) {
      for (const item of category.items) {
        const { value, count, lowStock } = calculateItemStats(item);
        totalValue += value;
        totalCount += count;
        lowStockCount += lowStock;
      }
    }

    return { totalValue, totalCount, lowStockCount };
  };

  const { totalValue, totalCount, lowStockCount } = calculateInventoryStats(products);
  const totalProducts = totalCount;
  const inventoryValue = totalValue;
  const lowStockItems = lowStockCount;
  const activeVendors = 18;

  const formatNumber = (num) =>
    new Intl.NumberFormat('en-IN').format(num);

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(num);

  return (
    <div className="wrapper bg-white min-vh-100 w-100">
      <div className="content py-3 px-0">
        <div className="container">
          <div className="card w-100" style={{ boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' }}>
           <div
              className="card-header"
              style={{
                background: 'linear-gradient(120deg, #3a7bd5, #00d2ff)',
                color: 'white',
                borderRadius: '10px 10px 0 0',
              }}
            >
              <div className="px-3 pt-2">
                <p className="text-light mb-2" style={{ fontSize: '0.9rem' }}>
                  Manage Client related Inventory
                </p>
              </div>

              <div className="w-100 px-3">
                <ul className="nav nav-tabs card-header-tabs d-flex w-100" style={{ borderBottom: 'none' }}>
                  <li className="nav-item flex-fill">
                    <a
                      className={`nav-link w-100 text-center ${activeTab === 'grouping' ? 'active' : ''}`}
                      style={{
                        borderRadius: '10px 10px 0 0',
                        backgroundColor: activeTab === 'grouping' ? '#007bff' : '#e9ecef',
                        color: activeTab === 'grouping' ? '#fff' : '#495057',
                        fontWeight: 500,
                        border: '1px solid #dee2e6',
                      }}
                      onClick={() => setActiveTab('grouping')}
                    >
                      <i className="bi bi-box-seam me-2"></i>
                      Inventory Grouping
                    </a>
                  </li>
                  <li className="nav-item flex-fill">
                    <a
                      className={`nav-link w-100 text-center ${activeTab === 'list' ? 'active' : ''}`}
                      style={{
                        borderRadius: '10px 10px 0 0',
                        backgroundColor: activeTab === 'list' ? '#007bff' : '#e9ecef',
                        color: activeTab === 'list' ? '#fff' : '#495057',
                        fontWeight: 500,
                        border: '1px solid #dee2e6',
                        borderLeft: 'none',
                      }}
                      onClick={() => setActiveTab('list')}
                    >
                      <i className="bi bi-list me-2"></i>
                      Inventory List
                    </a>
                  </li>
                </ul>
              </div>
            </div>


            <div className="card-body">
              <div className={`tab-content ${activeTab === 'grouping' || activeTab === 'list' ? 'active' : ''}`}>
                <div className={`tab-pane ${activeTab === 'grouping' ? 'active show' : ''}`} id="grouping">
                  <div className="row mb-4">
                    {[
                      {
                        label: 'Total Products',
                        value: formatNumber(totalProducts),
                        icon: 'bi-boxes',
                        color: '#3a7bd5',
                      },
                      {
                        label: 'Inventory Value',
                        value: formatCurrency(inventoryValue),
                        icon: 'bi-currency-rupee',
                        color: '#28a745',
                      },
                      {
                        label: 'Low Stock Items',
                        value: formatNumber(lowStockItems),
                        icon: 'bi-exclamation-triangle',
                        color: '#ffc107',
                      },
                      {
                        label: 'Active Vendors',
                        value: formatNumber(activeVendors),
                        icon: 'bi-people',
                        color: '#17a2b8',
                      },
                    ].map((stat, index) => (
                      <div className="col-md-3" key={index}>
                        <div
                          style={{
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            padding: '16px',
                            marginBottom: '20px',
                            borderLeft: `5px solid ${stat.color}`,
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div
                                style={{
                                  fontSize: '1.8rem',
                                  fontWeight: 600,
                                  lineHeight: 1.2,
                                }}
                              >
                                {stat.value}
                              </div>
                              <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                                {stat.label}
                              </div>
                            </div>
                            <i
                              className={`bi ${stat.icon}`}
                              style={{ fontSize: '1.8rem', color: stat.color }}
                            ></i>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Main products={products} />
                </div>
                <div className={`tab-pane ${activeTab === 'list' ? 'active show' : ''}`} id="list">
                  <InventoryList products={products} />
                </div>
              </div>
              <AddProductModal show={isModalOpen} onClose={closeModal} onProductAdded={handleProductAdded} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}