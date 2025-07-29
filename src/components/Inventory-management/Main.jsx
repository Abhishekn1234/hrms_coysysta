import React, { useState } from 'react';
import InventoryTable from './tabs/InventoryTable';
import InventorySidebar from './tabs/InventorySidebar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Main = (products) => {
  console.log(products);

  const exportToExcel = (data, fileName = 'InventoryData.xlsx') => {
    const rows = [];

    data.products.forEach(category => {
      category.items.forEach(item => {
        rows.push({
          Category: category.name,
          Name: item.name,
          SKU: item.sku,
          Stock: item.stock,
          MinStock: item.minStock,
          Unit: item.unit,
          Worth: item.worth,
          Status: item.status
        });

        item.subItems?.forEach(sub => {
          rows.push({
            Category: `${category.name} > ${item.name}`,
            Name: sub.name,
            SKU: sub.sku,
            Stock: sub.stock,
            MinStock: sub.minStock,
            Unit: sub.unit,
            Worth: sub.worth,
            Status: sub.status
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  const [inventoryData, setInventoryData] = useState({ categories: [] });
  const [expandedCategories, setExpandedCategories] = useState(['Electronics', 'Furniture']);
  const [expandedItems, setExpandedItems] = useState([1, 3]);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleCategory = (categoryName) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryName));
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  const toggleItem = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const handleSave = () => {
    console.log("here", category.name);
    console.log('Inventory saved', inventoryData);
  };

  return (
    <div className="container-fluid px-3">
      <div className="row g-3">
        {/* Main Content Area */}
        <div 
          className={showSidebar ? 'col-xl-9 col-lg-8' : 'col-12'} 
          style={{ 
            transition: 'all 0.3s ease',
            width: showSidebar ? 'calc(75% - 1rem)' : '100%'
          }}
        >
          <div 
            className="card mb-0 h-100"
            style={{ 
              boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)',
              minHeight: 'calc(100vh - 2rem)'
            }}
          >
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{
                background: 'linear-gradient(120deg, #3a7bd5, #00d2ff)',
                color: 'white',
                borderRadius: '10px 10px 0 0',
                padding: '12px 20px'
              }}
            >
              <h5 className="mb-0">Product Inventory</h5>
              <div className="d-flex align-items-center gap-2">
                <button onClick={() => exportToExcel(products)} className="btn btn-sm btn-light">
                  <i className="bi bi-download me-1"></i> Export
                </button>
                <button
                  onClick={() => setShowSidebar(prev => !prev)}
                  className="btn btn-sm btn-outline-light"
                >
                  <i className="bi bi-bar-chart me-1"></i>
                  {showSidebar ? 'Hide Stats' : 'Show Stats'}
                </button>
              </div>
            </div>
            <div className="card-body p-3">
              <InventoryTable
                data={inventoryData}
                expandedCategories={expandedCategories}
                expandedItems={expandedItems}
                toggleCategory={toggleCategory}
                toggleItem={toggleItem}
                onDataChange={setInventoryData}
                dataforSearch={products}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div 
            className="col-xl-3 col-lg-4"
            style={{ 
              transition: 'all 0.3s ease',
              width: '25%'
            }}
          >
            <div 
              className="card h-100"
              style={{ 
                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)',
                minHeight: 'calc(100vh - 2rem)'
              }}
            >
              <InventorySidebar sidebarData={products} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;