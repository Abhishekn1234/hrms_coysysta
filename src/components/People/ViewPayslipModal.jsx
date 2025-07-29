import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ViewPayslipModal = ({ show, onHide, staff }) => {
  const printRef = useRef(null);
  if (!staff || !show) return null;

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const totalEarnings = parseFloat(staff.daily_remuneration || 0) * 30;
  const totalDeductions =
    parseFloat(staff.tax || 0) + parseFloat(staff.tds || 0) + parseFloat(staff.loan || 0);
  const netPay = totalEarnings - totalDeductions;

  const handlePDFDownload = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/v1/generate-payslip-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(staff),
  });

  if (!response.ok) {
    console.error('Failed to fetch PDF:', response.status, response.statusText);
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Payslip_${staff.name}_${currentMonth}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};


  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: show ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '8px 8px 0 0'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    <span>
            Payroll Details – {staff.name} <span style={{ fontWeight: 'bold' }}>EMP</span>({staff.id}) – {currentMonth}
          </span>
          </h3>
          <button 
            onClick={onHide}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'white',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div 
          ref={printRef}
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          <h5 style={{ 
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '1.1rem'
          }}>
            Payroll Details for {staff.name}
          </h5>

          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Earnings Card */}
            <div style={{
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h6 style={{
                borderBottom: '1px solid #dee2e6',
                paddingBottom: '8px',
                fontSize: '1rem',
                color: '#28a745',
                marginTop: 0
              }}>
                Earnings
              </h6>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px 0'
                }}>
                  <span>Basic Salary</span>
                  <span>₹{(staff.daily_remuneration * 25).toLocaleString()}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px 0'
                }}>
                  <span>House Rent Allowance</span>
                  <span>₹{(staff.housing_allowance * 3).toLocaleString()}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px 0'
                }}>
                  <span>Transport Allowance</span>
                  <span>₹{(staff.transport_allowance * 2).toLocaleString()}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  borderTop: '1px solid #dee2e6',
                  paddingTop: '12px',
                  marginTop: '8px',
                  padding: '8px 0',
                  fontSize: '1.05rem'
                }}>
                  <span>Total Earnings</span>
                  <span>₹{totalEarnings.toLocaleString()}</span>
                </li>
              </ul>
            </div>

            {/* Deductions Card */}
            <div style={{
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h6 style={{
                borderBottom: '1px solid #dee2e6',
                paddingBottom: '8px',
                fontSize: '1rem',
                color: '#dc3545',
                marginTop: 0
              }}>
                Deductions
              </h6>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px 0'
                }}>
                  <span>Professional Tax</span>
                  <span>₹{staff.tax || 0}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px 0'
                }}>
                  <span>TDS</span>
                  <span>₹{staff.tds || 0}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px 0'
                }}>
                  <span>Loan Recovery</span>
                  <span>₹{staff.loan || 0}</span>
                </li>
                <li style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  borderTop: '1px solid #dee2e6',
                  paddingTop: '12px',
                  marginTop: '8px',
                  padding: '8px 0',
                  fontSize: '1.05rem'
                }}>
                  <span>Total Deductions</span>
                  <span>₹{totalDeductions.toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Net Pay Card */}
         <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    padding: '16px',
    gap: '8px', // spacing between label and amount
    textAlign: 'center',
  }}
>
  <span
    style={{
      fontSize: '1.5rem',
      color: '#007bff',
      fontWeight: '500',
    }}
  >
    Net Pay:
  </span>
  <span
    style={{
      fontSize: '1.5rem',
      color: '#28a745',
      fontWeight: '600',
    }}
  >
    ₹{netPay.toLocaleString()}
  </span>
</div>


          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '0.8rem',
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            *This is a system-generated payslip and does not require a signature.
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={onHide}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              color: '#6c757d',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Close
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => alert('✅ Payment processed successfully!')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #28a745',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Process Payment
            </button>
            <button
              onClick={handlePDFDownload}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #007bff',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPayslipModal;