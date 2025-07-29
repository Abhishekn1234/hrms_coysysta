import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

// Utility to format a date nicely
const formatDate = (date) => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

const randomCreatedDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const date = new Date(now);
  date.setDate(now.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

const InventorySidebar = ({ sidebarData }) => {
  const { products } = sidebarData;

  const recentActivityItems = [];

  products.forEach((group) => {
    recentActivityItems.push({
      icon: 'bi bi-folder-plus text-success',
      text: `Main product group "${group.name}" added`,
      date: randomCreatedDate(),
    });

    group.items.forEach((item) => {
      recentActivityItems.push({
        icon: 'bi bi-plus-circle-fill text-primary',
        text: `Product "${item.name}" added under "${group.name}"`,
        date: randomCreatedDate(),
      });

      item.subItems.forEach((subItem) => {
        recentActivityItems.push({
          icon: 'bi bi-arrow-return-right text-info',
          text: `Sub product "${subItem.name}" added under "${item.name}"`,
          date: randomCreatedDate(),
        });
      });
    });
  });

  recentActivityItems.sort((a, b) => b.date - a.date);

  const allItems = [];
  products.forEach(group => {
    group.items.forEach(item => {
      allItems.push(item);
      item.subItems?.forEach(sub => allItems.push(sub));
    });
  });

  const totalItems = allItems.length;
  const inStock = allItems.filter(item => Number(item.stock) > Number(item.minStock)).length;
  const lowStock = allItems.filter(item => Number(item.stock) > 0 && Number(item.stock) <= Number(item.minStock)).length;
  const outOfStock = allItems.filter(item => Number(item.stock) === 0).length;

  const inStockPercent = totalItems ? (inStock / totalItems) * 100 : 0;
  const lowStockPercent = totalItems ? (lowStock / totalItems) * 100 : 0;
  const outOfStockPercent = totalItems ? (outOfStock / totalItems) * 100 : 0;

  const pieData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [inStock, lowStock, outOfStock],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
    },
  };

  return (
    // <div className="col-lg-4">
    <div className="">
      <div className="card" style={{ boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' }}>
        <div className="card-header" style={{
          background: 'linear-gradient(120deg, #3a7bd5, #00d2ff)',
          color: 'white',
          borderRadius: '10px 10px 0 0',
          padding: '12px 20px',
        }}>
          <h5 className="mb-0">Inventory Summary</h5>
        </div>

        <div className="card-body">
          {/* Categories */}
          <div className="mb-4">
            <h6 className="section-title">Categories</h6>
            <div className="d-flex flex-wrap">
              {products.map((product) => (
                <span key={product.name} className="badge bg-primary me-2 mb-2">
                  {product.name} ({product.items.length})
                </span>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="mb-4">
            <h6 className="section-title">Stock Distribution</h6>
            <div style={{ height: '180px' }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Stock Bars */}
          <div className="mb-4">
            <h6 className="section-title">Stock Status</h6>

            <div className="d-flex mb-2">
              <div className="me-3" style={{ width: '60%' }}>
                In Stock ({inStock})
              </div>
              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: `${inStockPercent}%` }}>
                  {Math.round(inStockPercent)}%
                </div>
              </div>
            </div>

            <div className="d-flex mb-2">
              <div className="me-3" style={{ width: '60%' }}>
                Low Stock ({lowStock})
              </div>
              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${lowStockPercent}%` }}>
                  {Math.round(lowStockPercent)}%
                </div>
              </div>
            </div>

            <div className="d-flex">
              <div className="me-3" style={{ width: '60%' }}>
                Out of Stock ({outOfStock})
              </div>
              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${outOfStockPercent}%` }}>
                  {Math.round(outOfStockPercent)}%
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h6 className="section-title">Recent Activity</h6>
            <div className="list-group" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {recentActivityItems.map((activity, idx) => (
                <div key={idx} className="list-group-item border-0 px-0 py-2">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className={`${activity.icon}`}></i>
                    </div>
                    <div>
                      <div>{activity.text}</div>
                      <small className="text-muted">{formatDate(activity.date)}</small>
                    </div>
                  </div>
                </div>
              ))}

              {recentActivityItems.length === 0 && (
                <div className="text-muted px-2 py-3">
                  No recent activity available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySidebar;
