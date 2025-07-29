import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './quotation.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { generateQuotationPdf, processFileAttachments } from './generatePdf';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTrash, faEdit, faCopy, faDownload, 
  faFilePdf, faCog, faTimes, faSave, faFolderOpen,
  faChevronLeft, faChevronRight, faSearch
} from '@fortawesome/free-solid-svg-icons';

function Quotation() {
  // State management
  const [activePage, setActivePage] = useState('list');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerType, setSelectedCustomerType] = useState('');
  const [mockCustomers, setMockCustomers] = useState([]);
   const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  
  // Changed to arrays for multiple pages
  // const [frontPages, setFrontPages] = useState([
  //   { title: 'QUOTATION', content: 'Prepared for: ', attachments: [] }
  // ]);
  
  // const [backPages, setBackPages] = useState([
  //   { title: 'TERMS & CONDITIONS', content: '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.', attachments: [] }
  // ]);
  const [frontPages, setFrontPages] = useState([
    { title: 'QUOTATION', content: 'Prepared for: ', attachments: [] }
  ]);

  const [backPages, setBackPages] = useState([
    {
      title: 'TERMS & CONDITIONS',
      content: '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.',
      attachments: []
    }
  ]);
    
  const [attachments, setAttachments] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [searchQuoteTerm, setSearchQuoteTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [setupDate, setSetupDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [packupDate, setPackupDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionType, setActionType] = useState('');
  const [ccSearchTerm, setCcSearchTerm] = useState('');
  const [filteredCcCustomers, setFilteredCcCustomers] = useState([]);
  const [selectedCcEmails, setSelectedCcEmails] = useState([]);
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateAction, setTemplateAction] = useState('save'); // 'save' or 'load'
  const [activeFrontPageIndex, setActiveFrontPageIndex] = useState(0);
  const [activeBackPageIndex, setActiveBackPageIndex] = useState(0);

  // Inventory data initialization
  const initialInventoryData = [
  ];


  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [includeSetup, setIncludeSetup] = useState(true);
  const [expressShipping, setExpressShipping] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [projectName, setProjectName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customizationOpen, setCustomizationOpen] = useState(false);

  // Refs
  const customerSearchRef = useRef(null);
  const quoteSearchRef = useRef(null);
  const notesTextareaRef = useRef(null);
  const ccSearchRef = useRef(null);

  // Fetch inventory and templates
  useEffect(() => {
    fetchInventory();
    fetchQuotations();
    fetchTemplates();
  }, []);
  useEffect(() => {
  if (frontPages.length === 0) {
    setFrontPages([{ title: 'QUOTATION', content: 'Prepared for: ' }]);
    setActiveFrontPageIndex(0);
  }
  if (activeFrontPageIndex >= frontPages.length) {
    setActiveFrontPageIndex(frontPages.length - 1);
  }
}, [frontPages, activeFrontPageIndex]);

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/v1/quotations/quotationTemplates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Save template to API
//   const saveTemplate = useCallback(async () => {

//      console.log("inside save");
//   if (!templateName.trim()) {
//     setErrorMessage('Template name is required');
//     console.log("Template name is empty, exiting");
//     return;
//   }
  
//   try {
//     const templateData = {
//       name: templateName,
//       frontPages,
//       backPages,
//       // Include any other relevant data
//       items: selectedItems,
//       customerId: selectedCustomer?.id,
//       projectName
//     };
    
//     const response = await axios.post('/api/v1/templates', templateData);
//     console.log("this is response",response);
//     setSuccessMessage('Template saved successfully!');
//     setShowTemplateModal(false);
//     fetchTemplates(); // Refresh the template list
//   } catch (error) {
//     console.error('Error saving template:', error);
//     setErrorMessage('Failed to save template');
//   }
// }, [templateName, frontPages, backPages, selectedItems, selectedCustomer, projectName]);

// const saveTemplate = useCallback(async (name) => {
//   console.log("inside save, templateName:", name);
//   if (!name.trim()) {
//     setErrorMessage('Template name is required');
//     console.log("Template name is empty, exiting");
//     return;
//   }
  
//   try {
//     const templateData = {
//       name,
//       front_pages: frontPages, // Change to snake_case
//       back_pages: backPages,   // Change to snake_case
//       items: selectedItems,
//       project_name: projectName, // Change to snake_case
//       customer_id: selectedCustomer?.id 
//     };
    
//     console.log("Preparing to send templateData:", templateData);
//     const response = await axios.post('/api/v1/quotations/quotationTemplates/save', templateData);
//     console.log("this is response", response);
//     setSuccessMessage('Template saved successfully!');
//     setShowTemplateModal(false);
//     fetchTemplates();
//   } catch (error) {
//     console.error('Error saving template:', error.response?.data, error.response?.status, error.message);
//     setErrorMessage(`Failed to save template: ${error.response?.data?.message || error.message}`);
//   }
// }, [frontPages, backPages, selectedItems, selectedCustomer, projectName]);
const saveTemplate = useCallback(async (name) => {
    console.log("inside save, templateName:", name);
    if (!name.trim()) {
      setErrorMessage('Template name is required');
      console.log("Template name is empty, exiting");
      return;
    }

    if (!frontPages?.length || !backPages?.length) {
      setErrorMessage('At least one front page and one back page are required');
      console.log("Front or back pages are empty");
      return;
    }

    try {
      const templateData = {
        name,
        front_pages: JSON.stringify(frontPages), // Stringify to JSON string
        back_pages: JSON.stringify(backPages),   // Stringify to JSON string
        items: selectedItems ? JSON.stringify(selectedItems) : null, // Stringify or null
        project_name: projectName || '', // Ensure empty string if undefined
        customer_id: selectedCustomer?.id || null // Ensure null if undefined
      };
      
      console.log("Preparing to send templateData:", templateData);
      const response = await axios.post('/api/v1/quotations/quotationTemplates/save', templateData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("this is response", response);
      setSuccessMessage('Template saved successfully!');
      setShowTemplateModal(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error.response?.data, error.response?.status, error.message);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setErrorMessage(`Validation failed: ${errorMessages}`);
      } else {
        setErrorMessage(`Failed to save template: ${error.response?.data?.message || error.message}`);
      }
    }
  }, [frontPages, backPages, selectedItems, selectedCustomer, projectName]);

    // Load template
    const loadTemplate = useCallback((template) => {
    console.log('Loading template:', template);
    try {
      const frontPagesData = JSON.parse(template.front_pages || '[]');
      const backPagesData = JSON.parse(template.back_pages || '[]');
      const itemsData = template.items ? JSON.parse(template.items) : [];

      console.log('Parsed frontPages:', frontPagesData);
      console.log('Parsed backPages:', backPagesData);

      if (!Array.isArray(frontPagesData) || !Array.isArray(backPagesData) || !Array.isArray(itemsData)) {
        throw new Error('Invalid template data format');
      }

      setFrontPages(frontPagesData);
      setBackPages(backPagesData);
      setSelectedItems(itemsData);
      setProjectName(template.project_name || '');
      setSelectedCustomer(template.customer_id ? { id: template.customer_id } : null);
      setActiveFrontPageIndex(0);
      setSuccessMessage(`Template "${template.name}" loaded successfully!`);
      
      console.log('Closing TemplateModal');
      setShowTemplateModal(false);
    } catch (error) {
      console.error('Error loading template:', error);
      setErrorMessage('Failed to load template. Please try again.');
    }
  }, [setSelectedItems, setProjectName, setSelectedCustomer, setShowTemplateModal]);

  // Transform customer data
  const transformCustomerData = (apiData) => {
    return apiData.map((customer) => ({
      ...customer,
      inventory: customer.inventory.flatMap((item) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: item['inventory name'],
        available: item.items.reduce((sum, subItem) => sum + subItem.available, 0),
        price: item.items.reduce((sum, subItem) => sum + subItem.price, 0),
        vendor: item.items[0]?.vendor || 'N/A',
        days: item.items[0]?.days || 0,
        subItems: item.items || [],
      })),
    }));
  };

  // Fetch inventory
    const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/inventories/customer-inventories');
      // const response = await axios.get('/api/v1/inventories/customer-inventories');
      const transformedData = transformCustomerData(response.data);
      setMockCustomers(transformedData);
      return transformedData;
    } catch (error) {
      console.error('API error:', error);
      return [];
    }
  };

  // Fetch quotations
  const fetchQuotations = async () => {
    try {
     const response = await axios.get('http://localhost:8000/api/v1/quotations/list');
      setQuotations(response.data.data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  // Handle customer search
   const handleCustomerSearchChange = useCallback((e) => {
      const value = e.target.value;
      setCustomerSearchTerm(value);
      if (value.trim() === '') {
        setFilteredCustomers([]);
        return;
      }
      const filtered = mockCustomers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(value.toLowerCase()) ||
          customer.contactPerson.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }, [mockCustomers]);

  // Handle CC search
  const handleCcSearchChange = useCallback((e) => {
      const value = e.target.value;
      setCcSearchTerm(value);
      if (value.trim() === '') {
        setFilteredCcCustomers([]);
        return;
      }
      const filtered = mockCustomers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(value.toLowerCase()) ||
          customer.contactPerson.toLowerCase().includes(value.toLowerCase()) ||
          (customer.email && customer.email.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredCcCustomers(filtered);
    }, [mockCustomers]);

  // Handle quote search
  const handleQuoteSearchChange = useCallback((e) => {
      setSearchQuoteTerm(e.target.value);
    }, []);

  // Handle action notes
 const handleActionNotesChange = useCallback((e) => {
     setActionNotes(e.target.value);
   }, []);

  // Handle selected customer changes
  useEffect(() => {
      if (selectedCustomer) {
        setPhone(selectedCustomer.phone || '');
        setEmail(selectedCustomer.email || '');
        setLocation(selectedCustomer.location || '');
        // setFrontPage((prev) => ({
        //   ...prev,
        //   content: `Prepared for: ${selectedCustomer.name}`,
        // }));
      }
    }, [selectedCustomer]);
    

  // Recalculate summary
  useEffect(() => {
    recalcSummary();
  }, [selectedItems, includeSetup, expressShipping]);

  // Handle editing quotation
    //  useEffect(() => {
    // if (editingQuotation) {
    //     const customer = mockCustomers.find((c) => c.id === editingQuotation.customer_id);
    //     if (customer) {
    //     setSelectedCustomer(customer);
    //     if (!editingQuotation.isCloned) {
    //         setInventoryData(customer.inventory || initialInventoryData);
    //     }
    //     } else {
    //     setSelectedCustomer({
    //         id: editingQuotation.customer_id,
    //         name: editingQuotation.customer_name,
    //         phone: editingQuotation.phone || '',
    //         email: editingQuotation.email || '',
    //         location: editingQuotation.location || '',
    //     });
    //     if (!editingQuotation.isCloned) {
    //         setInventoryData(initialInventoryData);
    //     }
    //     }
    //     setCustomerSearchTerm(editingQuotation.customer_name || '');
    //     setProjectName(editingQuotation.project_name || '');
    //     setSelectedItems(editingQuotation.items || []);
    //     setSubtotal(Number(editingQuotation.subtotal) || 0);
    //     setDiscount(Number(editingQuotation.discount) || 0);
    //     setTax(Number(editingQuotation.tax) || 0);
    //     setTotalAmount(Number(editingQuotation.total_amount) || 0);
    //     setIncludeSetup(editingQuotation.include_setup || true);
    //     setExpressShipping(editingQuotation.express_shipping || false);
        
    //     // UPDATE FOR MULTIPLE PAGES STARTS HERE:
    //     // Handle front pages
    //     if (editingQuotation.frontPages && editingQuotation.frontPages.length > 0) {
    //     setFrontPages(editingQuotation.frontPages);
    //     } else if (editingQuotation.front_page) {
    //     // Convert legacy single page to array format
    //     setFrontPages([{
    //         title: editingQuotation.front_page.title || 'QUOTATION',
    //         content: editingQuotation.front_page.content || `Prepared for: ${editingQuotation.customer_name || ''}`
    //     }]);
    //     } else {
    //     // Default to single page
    //     setFrontPages([{
    //         title: 'QUOTATION',
    //         content: `Prepared for: ${editingQuotation.customer_name || ''}`
    //     }]);
    //     }
        
    //     // Handle back pages
    //     if (editingQuotation.backPages && editingQuotation.backPages.length > 0) {
    //     setBackPages(editingQuotation.backPages);
    //     } else if (editingQuotation.back_page) {
    //     // Convert legacy single page to array format
    //     setBackPages([{
    //         title: editingQuotation.back_page.title || 'TERMS & CONDITIONS',
    //         content: editingQuotation.back_page.content || '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.'
    //     }]);
    //     } else {
    //     // Default to single page
    //     setBackPages([{
    //         title: 'TERMS & CONDITIONS',
    //         content: '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.'
    //     }]);
    //     }
        
    //     // Reset active page indices
    //     setActiveFrontPageIndex(0);
    //     setActiveBackPageIndex(0);
    //     // UPDATE FOR MULTIPLE PAGES ENDS HERE

    //     setAttachments(editingQuotation.attachments || []);
    //     setSelectedCcEmails(editingQuotation.cc_emails || []);
    //     setSendViaWhatsApp(editingQuotation.send_via_whatsapp || false);
    //     setActivePage('create');
    //     setActiveTab('details');
    //     setSetupDate(
    //     editingQuotation.setupDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    //     );
    //     setPackupDate(
    //     editingQuotation.packupDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    //     );
        
    //     // Load template if exists
    //     if (editingQuotation.template_id) {
    //     const template = templates.find(t => t.id === editingQuotation.template_id);
    //     if (template) {
    //         setCurrentTemplate(template);
    //     }
    //     }
    // }
    // }, [editingQuotation, mockCustomers, templates]); // Added templates to dependencies
    useEffect(() => {
      if (editingQuotation) {
        const customer = mockCustomers.find((c) => c.id === editingQuotation.customer_id);
        if (customer) {
          setSelectedCustomer(customer);
          if (!editingQuotation.isCloned) {
            setInventoryData(customer.inventory || initialInventoryData);
          }
        } else {
          setSelectedCustomer({
            id: editingQuotation.customer_id,
            name: editingQuotation.customer_name,
            phone: editingQuotation.phone || '',
            email: editingQuotation.email || '',
            location: editingQuotation.location || '',
          });
          if (!editingQuotation.isCloned) {
            setInventoryData(initialInventoryData);
          }
        }
        setCustomerSearchTerm(editingQuotation.customer_name || '');
        setProjectName(editingQuotation.project_name || '');
        setSelectedItems(editingQuotation.items || []);
        setSubtotal(Number(editingQuotation.subtotal) || 0);
        setDiscount(Number(editingQuotation.discount) || 0);
        setTax(Number(editingQuotation.tax) || 0);
        setTotalAmount(Number(editingQuotation.total_amount) || 0);
        setIncludeSetup(editingQuotation.include_setup || true);
        setExpressShipping(editingQuotation.express_shipping || false);

        // Handle front pages
        let frontPagesData = [];
        if (editingQuotation.frontPages && Array.isArray(editingQuotation.frontPages)) {
          frontPagesData = editingQuotation.frontPages.map(page => ({
            ...page,
            attachments: Array.isArray(page.attachments) ? page.attachments : []
          }));
        } else if (editingQuotation.front_page) {
          frontPagesData = [{
            title: editingQuotation.front_page.title || 'QUOTATION',
            content: editingQuotation.front_page.content || `Prepared for: ${editingQuotation.customer_name || ''}`,
            attachments: []
          }];
        } else {
          frontPagesData = [{
            title: 'QUOTATION',
            content: `Prepared for: ${editingQuotation.customer_name || ''}`,
            attachments: []
          }];
        }
        setFrontPages(frontPagesData);

        // Handle back pages
        let backPagesData = [];
        if (editingQuotation.backPages && Array.isArray(editingQuotation.backPages)) {
          backPagesData = editingQuotation.backPages.map(page => ({
            ...page,
            attachments: Array.isArray(page.attachments) ? page.attachments : []
          }));
        } else if (editingQuotation.back_page) {
          backPagesData = [{
            title: editingQuotation.back_page.title || 'TERMS & CONDITIONS',
            content: editingQuotation.back_page.content || '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.',
            attachments: []
          }];
        } else {
          backPagesData = [{
            title: 'TERMS & CONDITIONS',
            content: '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.',
            attachments: []
          }];
        }
        setBackPages(backPagesData);

        // Reset active page indices
        setActiveFrontPageIndex(0);
        setActiveBackPageIndex(0);

        setAttachments(editingQuotation.attachments || []);
        setSelectedCcEmails(editingQuotation.cc_emails || []);
        setSendViaWhatsApp(editingQuotation.send_via_whatsapp || false);
        setActivePage('create');
        setActiveTab('details');
        setSetupDate(
          editingQuotation.setupDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        );
        setPackupDate(
          editingQuotation.packupDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        );

        // Load template if exists
        if (editingQuotation.template_id) {
          const template = templates.find(t => t.id === editingQuotation.template_id);
          if (template) {
            setCurrentTemplate(template);
          }
        }
      }
    }, [editingQuotation, mockCustomers, templates]);
   const updateFrontPageForCustomer = (customerName) => {
    setFrontPages(prev => {
      const newPages = [...prev];
      if (newPages.length > 0) {
        newPages[0] = {
          ...newPages[0],
          content: `Prepared for: ${customerName}`
        };
      }
      return newPages;
    });
  };

  // Handle customer select
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm(customer.name);
    setFilteredCustomers([]);
    setSelectedCustomerType(customer.type || '');
    updateFrontPageForCustomer(customer.name); // Add this
    setFrontPages(prev => {
    const newPages = [...prev];
    if (newPages.length > 0) {
        newPages[0] = { 
          ...newPages[0], 
          content: `Prepared for: ${customer.name}` 
        };
      } else {
        newPages.push({ title: 'QUOTATION', content: `Prepared for: ${customer.name}` });
      }
      return newPages;
    });
    
    if (!editingQuotation) {
      setInventoryData(customer.inventory || initialInventoryData);
      setSelectedItems([]);
      setExpandedRows(new Set());
    }
  };
    

  // Handle CC select
 const handleCcSelect = (customer) => {
    if (customer.email && !selectedCcEmails.includes(customer.email)) {
      setSelectedCcEmails((prev) => [...prev, customer.email]);
      setCcSearchTerm('');
      setFilteredCcCustomers([]);
    }
  };

  // Remove CC email
  const removeCcEmail = (email) => {
    setSelectedCcEmails((prev) => prev.filter((e) => e !== email));
  };

  // Clear customer selection
  const clearCustomerSelection = () => {
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setSelectedCustomerType('');
    
    if (!editingQuotation) {
      setInventoryData(initialInventoryData);
      setSelectedItems([]);
      setExpandedRows(new Set());
    }
  };

  // Toggle row
  const toggleRow = useCallback((id) => {
      setExpandedRows((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return newSet;
      });
    }, []);

  // Expand all rows
  const expandAll = () => {
    const collectParents = (items, parents = new Set()) => {
      items.forEach((item) => {
        if (item.subItems && item.subItems.length) {
          parents.add(item.id);
          collectParents(item.subItems, parents);
        }
      });
      return parents;
    };
    setExpandedRows(collectParents(inventoryData));
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  // Row matches filter
   const rowMatchesFilter = (item) => {
    const searchTermLower = searchTerm.trim().toLowerCase();
    const matchesName = searchTerm === '' || item.name.toLowerCase().includes(searchTermLower);
    const vendorLower = vendorFilter.toLowerCase();
    const matchesVendor = vendorFilter === '' || item.vendor.toLowerCase() === vendorLower;
    const childMatches =
      item.subItems && item.subItems.length > 0 ? item.subItems.some((child) => rowMatchesFilter(child)) : false;
    return (matchesName && matchesVendor) || childMatches;
  };

  
    const collectAllItems = (items, collected = []) => {
      items.forEach((item) => {
        collected.push({
          id: item.id,
          name: item.name,
          qty: item.qty || 1,
          price: item.price,
          days: item.days,
          vendor: item.vendor,
          available: item.available,
        });
        if (item.subItems && item.subItems.length > 0) {
          collectAllItems(item.subItems, collected);
        }
      });
      return collected;
    };
  
    const renderInventoryRows = (items, level = 0, parentId = null) => {
      return items.flatMap((item) => {
        const hasChildren = Array.isArray(item.subItems) && item.subItems.length > 0;
        const isExpanded = expandedRows.has(item.id);
        const visibleBySearch = rowMatchesFilter(item);
        const shouldRender = visibleBySearch && (parentId === null || expandedRows.has(parentId));
        const uniqueKey = parentId ? `${parentId}-${item.id}` : `root-${item.id}`;
  
        let row = null;
        if (shouldRender) {
          row = (
            <tr
              key={uniqueKey}
              className={`level-${level} ${hasChildren ? 'parent-item' : ''}`}
              data-id={item.id}
            >
              <td>
                <input
                  type="checkbox"
                  className="form-check-input item-checkbox"
                  onChange={(e) => handleItemCheckboxChange(e, item)}
                  checked={selectedItems.some((si) => si.id === item.id)}
                />
              </td>
              <td>
                {hasChildren ? (
                  <span
                    className={`toggle-symbol ${isExpanded ? 'expanded' : 'collapsed'}`}
                    onClick={() => toggleRow(item.id)}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </span>
                ) : (
                  <span style={{ display: 'inline-block', width: '24px' }}></span>
                )}{' '}
                {item.name}
              </td>
              <td>{item.available}</td>
              <td>
                <input
                  type="number"
                  className="form-control qty-input"
                  min="1"
                  max={item.available}
                  value={selectedItems.find((si) => si.id === item.id)?.qty ?? 1}
                  onChange={(e) => handleQtyChangeInventory(item.id, e.target.value)}
                  style={{ maxWidth: '100px' }}
                />
              </td>
              <td>{item.days}</td>
              <td>{item.vendor}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          );
        }
  
        const childrenRows = [];
        if (hasChildren && isExpanded) {
          childrenRows.push(...renderInventoryRows(item.subItems, level + 1, item.id));
        }
  
        return shouldRender ? [row, ...childrenRows].filter(Boolean) : [];
      });
    };
  
    const handleItemCheckboxChange = (e, item) => {
      const checked = e.target.checked;
      setSelectedItems((prev) => {
        if (checked) {
          if (prev.find((si) => si.id === item.id)) return prev;
          return [
            ...prev,
            {
              id: item.id,
              name: item.name,
              qty: 1,
              price: item.price,
              days: item.days,
              vendor: item.vendor,
              available: item.available,
            },
          ];
        } else {
          return prev.filter((si) => si.id !== item.id);
        }
      });
    };
  
    const handleQtyChangeInventory = (itemId, value) => {
      const newQty = Math.max(1, parseInt(value) || 1);
      setSelectedItems((prev) =>
        prev.map((si) => {
          if (si.id === itemId) {
            const qty = Math.min(newQty, si.available);
            return { ...si, qty };
          }
          return si;
        })
      );
    };
  
    const handleQtyChangeSelected = (itemId, value) => {
      const newQty = Math.max(1, parseInt(value) || 1);
      setSelectedItems((prev) =>
        prev.map((si) => {
          if (si.id === itemId) {
            const qty = Math.min(newQty, si.available);
            return { ...si, qty };
          }
          return si;
        })
      );
    };
  
    const removeSelectedItem = (itemId) => {
      setSelectedItems((prev) => prev.filter((si) => si.id !== itemId));
    };
  
    const handleSelectAll = (e) => {
      const checked = e.target.checked;
      if (checked) {
        const allVisible = [];
        const collectVisible = (items) => {
          items.forEach((item) => {
            if (rowMatchesFilter(item)) {
              allVisible.push({
                id: item.id,
                name: item.name,
                qty: 1,
                days: item.days,
                price: item.price,
                vendor: item.vendor,
                available: item.available,
              });
              if (item.subItems && item.subItems.length > 0 && expandedRows.has(item.id)) {
                collectVisible(item.subItems);
              }
            }
          });
        };
        collectVisible(inventoryData);
        setSelectedItems((prev) => {
          const map = new Map();
          prev.forEach((si) => map.set(si.id, si));
          allVisible.forEach((item) => {
            if (!map.has(item.id)) {
              map.set(item.id, item);
            }
          });
          return Array.from(map.values());
        });
      } else {
        setSelectedItems([]);
      }
    };
  
    const recalcSummary = useCallback(() => {
      let base = selectedItems.reduce((sum, si) => sum + si.qty * si.price, 0);
      const disc = base * 0.05;
      const taxed = (base - disc) * 0.08;
      let shipping = 75 + (expressShipping ? 50 : 0);
      if (includeSetup) base += 150;
      const total = base - disc + taxed + shipping;
  
      setSubtotal(base);
      setDiscount(disc);
      setTax(taxed);
      setTotalAmount(total);
    }, [selectedItems, includeSetup, expressShipping]);
    // Handle adding attachments to specific page
  //   const handlePageAttachmentChange = (pageType, pageIndex, e) => {
  //     const files = Array.from(e.target.files);
  //     const newPreviews = files.map(file => ({
  //       url: URL.createObjectURL(file),
  //       type: file.type,
  //       name: file.name,
  //       file
  //     }));

  //     if (pageType === 'front') {
  //       setFrontPages(prev => prev.map((page, idx) => 
  //         idx === pageIndex 
  //           ? { ...page, attachments: [...page.attachments, ...newPreviews] }
  //           : page
  //       ));
  //     } else {
  //       setBackPages(prev => prev.map((page, idx) => 
  //         idx === pageIndex 
  //           ? { ...page, attachments: [...page.attachments, ...newPreviews] }
  //           : page
  //       ));
  //     }
  //   };

  //   // Handle removing attachments from specific page
  //   const removePageAttachment = (pageType, pageIndex, attachmentIndex) => {
  //       if (pageType === 'front') {
  //         setFrontPages(prev => prev.map((page, idx) => 
  //           idx === pageIndex 
  //             ? { 
  //                 ...page, 
  //                 attachments: page.attachments.filter((_, i) => i !== attachmentIndex) 
  //               }
  //             : page
  //         ));
  //       } else {
  //         setBackPages(prev => prev.map((page, idx) => 
  //           idx === pageIndex 
  //             ? { 
  //                 ...page, 
  //                 attachments: page.attachments.filter((_, i) => i !== attachmentIndex) 
  //               }
  //             : page
  //         ));
  //       }
  // };
  // Clean up object URLs when component unmounts
  // const handlePageAttachmentChange = (pageType, pageIndex, e) => {
  //   const files = Array.from(e.target.files);
  //   const newPreviews = files.map(file => ({
  //     url: URL.createObjectURL(file),
  //     type: file.type,
  //     name: file.name,
  //     file
  //   }));

  //   if (pageType === 'front') {
  //     setFrontPages(prev => prev.map((page, idx) =>
  //       idx === pageIndex
  //         ? { ...page, attachments: [...(page.attachments || []), ...newPreviews] }
  //         : page
  //     ));
  //   } else {
  //     setBackPages(prev => prev.map((page, idx) =>
  //       idx === pageIndex
  //         ? { ...page, attachments: [...(page.attachments || []), ...newPreviews] }
  //         : page
  //     ));
  //   }
  // };
  // const handlePageAttachmentChange = (pageType, pageIndex, e) => {
  //   const files = Array.from(e.target.files);

  //   // Process each file to get base64 data
  //   const processFiles = files.map(file => {
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         resolve({
  //           url: URL.createObjectURL(file),
  //           type: file.type,
  //           name: file.name,
  //           data: reader.result // Base64 string, e.g., "data:image/jpeg;base64,..."
  //         });
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   });

  //   // Wait for all files to be processed
  //   Promise.all(processFiles).then(newPreviews => {
  //     if (pageType === 'front') {
  //       setFrontPages(prev => prev.map((page, idx) =>
  //         idx === pageIndex
  //           ? { ...page, attachments: [...(page.attachments || []), ...newPreviews] }
  //           : page
  //       ));
  //     } else {
  //       setBackPages(prev => prev.map((page, idx) =>
  //         idx === pageIndex
  //           ? { ...page, attachments: [...(page.attachments || []), ...newPreviews] }
  //           : page
  //       ));
  //     }
  //   });
  // };
 const handlePageAttachmentChange = (pageType, pageIndex, e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const processFiles = files.map(file => {
    return new Promise((resolve, reject) => {
      // First validate it's a proper File object
      if (!(file instanceof Blob)) {
        reject(new Error(`Invalid file object: ${file.name}`));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = () => {
        if (!reader.result) {
          reject(new Error(`File read resulted in empty data: ${file.name}`));
          return;
        }
        
        // For images, get dimensions
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              data: reader.result, // This must be a valid base64 string
              width: img.width,
              height: img.height
            });
          };
          img.onerror = () => resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            data: reader.result,
            width: 0,
            height: 0
          });
          img.src = URL.createObjectURL(file);
        } else {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            data: reader.result,
            width: 0,
            height: 0
          });
        }
      };

      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        reject(new Error(`File read error: ${error.message}`));
      }
    });
  });

  Promise.all(processFiles)
    .then(newAttachments => {
      const updatePages = (pages) => pages.map((page, idx) => 
        idx === pageIndex
          ? { 
              ...page, 
              attachments: [
                ...(page.attachments || []), 
                ...newAttachments.filter(att => att.data) // Only include attachments with valid data
              ] 
            }
          : page
      );

      pageType === 'front' 
        ? setFrontPages(prev => updatePages(prev))
        : setBackPages(prev => updatePages(prev));
    })
    .catch(error => {
      console.error('Attachment error:', error);
      alert(`Could not add attachment: ${error.message}`);
    });
};

  const removePageAttachment = (pageType, pageIndex, attachmentIndex) => {
    if (pageType === 'front') {
      setFrontPages(prev => prev.map((page, idx) =>
        idx === pageIndex
          ? { ...page, attachments: (page.attachments || []).filter((_, i) => i !== attachmentIndex) }
          : page
      ));
    } else {
      setBackPages(prev => prev.map((page, idx) =>
        idx === pageIndex
          ? { ...page, attachments: (page.attachments || []).filter((_, i) => i !== attachmentIndex) }
          : page
      ));
    }
  };
useEffect(() => {
  return () => {
    // Clean up object URLs
    frontPages.forEach(page => {
      (page.attachments || []).forEach(attachment => {
        URL.revokeObjectURL(attachment.url);
      });
    });
    backPages.forEach(page => {
      (page.attachments || []).forEach(attachment => {
        URL.revokeObjectURL(attachment.url);
      });
    });
  };
}, [frontPages, backPages]);
  
   const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
    }));
    setAttachments((prev) => [...prev, ...files]);
    setAttachmentPreviews((prev) => [...prev, ...previews]);
    };
  
    const removeAttachment = (index) => {
      setAttachments((prev) => prev.filter((_, i) => i !== index));
      setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
    };

  // Clean up previews
  useEffect(() => {
    return () => {
      attachmentPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [attachmentPreviews]);

  // Generate PDF
    const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
        if (!selectedCustomer) {
        throw new Error("Please select a customer first");
        }

        if (!projectName.trim()) {
        throw new Error("Project name is required");
        }

        if (selectedItems.length === 0) {
        throw new Error("Please select at least one inventory item");
        }

        const normalize = (str) => (str || '').trim().toLowerCase();
        const isResubmission = editingQuotation?.status === 'rejected';

        if (!isResubmission) {
        const duplicate = quotations.find(
            (q) =>
            q.customer_id === selectedCustomer?.id &&
            normalize(q.project_name) === normalize(projectName) &&
            (!editingQuotation || q.id !== editingQuotation.id)
        );

        if (duplicate) {
            throw new Error(
            `A quotation for customer "${selectedCustomer?.name}" and project "${projectName}" already exists (Quotation ID: ${duplicate.quotation_number}).`
            );
        }
        }

        const processedAttachments = await processFileAttachments(attachments);

        const quotationData = {
        customerName: selectedCustomer?.name || 'N/A',
        projectName,
        date: new Date().toLocaleDateString(),
        items: selectedItems,
        subtotal,
        discount,
        tax,
        totalAmount,
        includeSetup,
        expressShipping,
        frontPages, // Now using multiple front pages
        backPages,  // Now using multiple back pages
        attachments: processedAttachments,
        setupDate,
        packupDate,
        ccEmails: selectedCcEmails,
        sendViaWhatsApp,
        templateId: currentTemplate?.id || null, // Include template ID if exists
        };

        const { filePath, pdfBlob } = await generateQuotationPdf(quotationData);

        const savedQuotation = await saveQuotationData(quotationData, filePath);

        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `quotation_${quotationData.customerName}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setSuccessMessage('PDF generated and saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
        console.error('Error:', error);
        setErrorMessage(error.message || 'Failed to generate PDF. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
    } finally {
        setIsGeneratingPdf(false);
    }
    };

    const saveQuotationData = async (quotationData, filePath) => {
    try {
        const isResubmission = editingQuotation?.status === 'rejected';
        const response = await axios.post('http://localhost:8000/api/v1/quotations/saveall', {

        // const response = await axios.post('/api/v1/quotations/saveall', {
        ...quotationData,
        customerId: selectedCustomer?.id || null,
        status: 'draft',
        pdfPath: filePath,
        setupDate: quotationData.setupDate,
        packupDate: quotationData.packupDate,
        is_resubmission: isResubmission,
        parent_quotation_id: isResubmission ? editingQuotation?.id : null,
        cc_emails: quotationData.ccEmails,
        send_via_whatsapp: quotationData.sendViaWhatsApp,
        frontPages: quotationData.frontPages, // Save multiple front pages
        backPages: quotationData.backPages,   // Save multiple back pages
        template_id: quotationData.templateId, // Save template association
        });
        
        fetchQuotations();
        return response.data;
        
    } catch (error) {
        console.error('Save error:', error);
        
        const serverMessage = error.response?.data?.message;
        const errorMsg = serverMessage || error.message || 'Failed to save quotation';
        
        throw new Error(errorMsg);
    }
    };

  // Handle front page change
  const handleFrontPageChange = (index, field, value) => {
    setFrontPages(prev => {
      const newPages = [...prev];
      newPages[index] = { ...newPages[index], [field]: value };
      return newPages;
    });
  };

  // Handle back page change
  const handleBackPageChange = (index, field, value) => {
    setBackPages(prev => {
      const newPages = [...prev];
      newPages[index] = { ...newPages[index], [field]: value };
      return newPages;
    });
  };

  // Add a new front page
  const addFrontPage = () => {
    setFrontPages(prev => [
      ...prev,
      { title: `Page ${prev.length + 1}`, content: '' }
    ]);
    setActiveFrontPageIndex(frontPages.length);
  };

  // Add a new back page
  const addBackPage = () => {
    setBackPages(prev => [
      ...prev,
      { title: `Page ${prev.length + 1}`, content: '' }
    ]);
    setActiveBackPageIndex(backPages.length);
  };

  // Remove front page
  const removeFrontPage = (index) => {
    if (frontPages.length <= 1) {
      setErrorMessage("You must have at least one front page");
      return;
    }
    
    setFrontPages(prev => prev.filter((_, i) => i !== index));
    if (activeFrontPageIndex >= index) {
      setActiveFrontPageIndex(Math.max(0, activeFrontPageIndex - 1));
    }
  };

  // Remove back page
  const removeBackPage = (index) => {
    if (backPages.length <= 1) {
      setErrorMessage("You must have at least one back page");
      return;
    }
    
    setBackPages(prev => prev.filter((_, i) => i !== index));
    if (activeBackPageIndex >= index) {
      setActiveBackPageIndex(Math.max(0, activeBackPageIndex - 1));
    }
  };

  // Toggle customization
  const toggleCustomization = () => {
    setCustomizationOpen(!customizationOpen);
  };

  const TemplateModal = React.memo(({ isOpen, onClose, templates, onSave, onLoad, onDelete }) => {
  const nameInputRef = useRef(null);
  const [templateName, setTemplateName] = useState('');
  const [templateAction, setTemplateAction] = useState('save');

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = useCallback(() => {
    if (!templateName.trim()) return;
    onSave(templateName);  // Pass the name to parent
    setTemplateName('');
  }, [templateName, onSave]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && templateAction === 'save') {
      handleSave();
    }
  }, [templateAction, handleSave]);

    if (!isOpen) return null;

    return (
      <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Manage Templates</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Template Name</label>
                <input
                  type="text"
                  className="form-control"
                  ref={nameInputRef}
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter template name"
                />
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <button 
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!templateName.trim()}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save Current as Template
                </button>
                
                <div>
                  <button 
                    className={`btn ${templateAction === 'save' ? 'btn-outline-primary' : 'btn-outline-secondary'} me-2`}
                    onClick={() => setTemplateAction('save')}
                  >
                    Save
                  </button>
                  <button 
                    className={`btn ${templateAction === 'load' ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setTemplateAction('load')}
                  >
                    Load
                  </button>
                </div>
              </div>
              
              {templateAction === 'load' && (
                <div className="template-list mt-4">
                  <h6>Saved Templates:</h6>
                  {templates.length === 0 ? (
                    <div className="alert alert-info">No templates saved yet</div>
                  ) : (
                    <div className="list-group">
                      {templates.map(template => (
                        <div 
                          key={template.id} 
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{template.name}</strong>
                            <div className="small text-muted">
                              {template.frontPages?.length || 0} front pages, 
                              {template.backPages?.length || 0} back pages
                            </div>
                          </div>
                          <div>
                            <button 
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => onLoad(template)}
                            >
                              <FontAwesomeIcon icon={faFolderOpen} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onDelete(template.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });
   const ActionModal = React.memo(({ 
      isOpen, 
      onClose, 
      actionType, 
      setActionType, 
      actionNotes, 
      setActionNotes, 
      onSubmit, 
      notesRef,
      mockCustomers // Added to access customer data
    }) => {
      const [ccSearchTerm, setCcSearchTerm] = useState('');
      const [filteredCcCustomers, setFilteredCcCustomers] = useState([]);
      const [ccEmails, setCcEmails] = useState([]);
      const [includeWhatsApp, setIncludeWhatsApp] = useState(false);
  
      if (!isOpen) return null;
  
      const handleCcSearchChange = (e) => {
        const value = e.target.value;
        setCcSearchTerm(value);
        if (value.trim() === '') {
          setFilteredCcCustomers([]);
          return;
        }
        
        const filtered = mockCustomers.filter(
          customer => 
            customer.name.toLowerCase().includes(value.toLowerCase()) ||
            customer.email?.toLowerCase().includes(value.toLowerCase()) ||
            customer.contactPerson?.toLowerCase().includes(value.toLowerCase())
        );
        
        setFilteredCcCustomers(filtered);
      };
  
      const handleCcSelect = (customer) => {
        if (customer.email && !ccEmails.includes(customer.email)) {
          setCcEmails([...ccEmails, customer.email]);
        }
        setCcSearchTerm('');
        setFilteredCcCustomers([]);
      };
  
      const removeCcEmail = (email) => {
        setCcEmails(ccEmails.filter(e => e !== email));
      };
  
      const handleSubmit = () => {
        onSubmit(ccEmails, includeWhatsApp);
      };
  
      return (
        <>
          <div
            className="modal show"
            style={{ display: 'block' }}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="actionModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg" role="document"> {/* Increased to modal-lg */}
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="actionModalLabel">
                    Quotation Action
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Action</label>
                        <select
                          className="form-select"
                          value={actionType}
                          onChange={(e) => setActionType(e.target.value)}
                        >
                          <option value="">Select Action</option>
                          <option value="Approved">Approve</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">CC Emails</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search customers to add CC..."
                            value={ccSearchTerm}
                            onChange={handleCcSearchChange}
                          />
                          {filteredCcCustomers.length > 0 && (
                            <div className="customer-dropdown position-absolute bg-white mt-1 w-100 border rounded shadow-sm z-3">
                              {filteredCcCustomers.map((customer) => (
                                <div
                                  key={customer.id}
                                  className="p-2 border-bottom"
                                  onClick={() => handleCcSelect(customer)}
                                  style={{ 
                                    cursor: 'pointer',
                                    backgroundColor: '#fff',
                                    transition: 'background-color 0.2s',
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                                >
                                  <div className="fw-bold">{customer.name}</div>
                                  {customer.email && <small className="text-muted">{customer.email}</small>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {ccEmails.length > 0 && (
                          <div className="mt-2 d-flex flex-wrap gap-2">
                            {ccEmails.map((email, index) => (
                              <span key={index} className="badge bg-primary d-flex align-items-center">
                                {email}
                                <button
                                  type="button"
                                  className="btn-close btn-close-white ms-2"
                                  aria-label="Remove"
                                  onClick={() => removeCcEmail(email)}
                                  style={{ fontSize: '0.5rem' }}
                                ></button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={actionNotes}
                          onChange={(e) => setActionNotes(e.target.value)}
                          placeholder="Enter any notes for this action..."
                          ref={notesRef}
                        />
                      </div>
                      
                      <div className="form-check mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="whatsappCheck"
                          checked={includeWhatsApp}
                          onChange={(e) => setIncludeWhatsApp(e.target.checked)}
                        />
                        <label className="form-check-label d-flex align-items-center" htmlFor="whatsappCheck">
                          <i className="fab fa-whatsapp text-success me-2 fs-5"></i>
                          Send notification via WhatsApp
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={!actionType}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="modal-backdrop show"></div> */}
        </>
      );
  });

  // Quotation List Component
    const QuotationList = React.memo(() => {
    const [loadingStates, setLoadingStates] = useState({});

    useEffect(() => {
      if (quoteSearchRef.current) {
        quoteSearchRef.current.focus();
      }
    }, []);

    useEffect(() => {
      if (showActionModal && notesTextareaRef.current) {
        notesTextareaRef.current.focus();
      }
    }, [showActionModal]);

    useEffect(() => {
      console.log('Quotations in QuotationList:', quotations);
    }, [quotations]);

    const hasPendingResubmission = useCallback((quotationNumber) => {
      return quotations.some((q) => {
        const isResubmission = q.is_resubmission === 1 || q.is_resubmission === true;
        const isPending = q.status.toLowerCase() === 'pending';
        const isParent = q.parent_quotation_number === quotationNumber;
        return isParent && isResubmission && isPending;
      });
    }, [quotations]);

    const setLoading = (quoteId, action, isLoading) => {
      setLoadingStates((prev) => ({
        ...prev,
        [quoteId]: {
          ...prev[quoteId],
          [action]: isLoading,
        },
      }));
    };

    const handleEditQuotation = useCallback(
      async (quotation) => {
        setLoading(quotation.id, 'edit', true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setEditingQuotation(quotation);
        } catch (error) {
          console.error('Error editing quotation:', error);
          setErrorMessage('Failed to load quotation for editing.');
        } finally {
          setLoading(quotation.id, 'edit', false);
        }
      },
      []
    );

   const handleCloneQuotation = useCallback(
    async (quotation) => {
      setLoading(quotation.id, 'clone', true);
      try {
        const customer = mockCustomers.find((c) => c.id === quotation.customer_id) || {
          id: quotation.customer_id,
          name: quotation.customer_name,
          phone: quotation.phone || '',
          email: quotation.email || '',
          location: quotation.location || '',
          inventory: initialInventoryData,
        };

        const flattenedInventory = collectAllItems(customer.inventory || initialInventoryData);

        const clonedItems = quotation.items ? [...quotation.items] : [];
        const expandedItemIds = new Set();

        const collectParentIds = (items, selectedItemIds, parentIds = new Set()) => {
          items.forEach((item) => {
            if (item.subItems && item.subItems.length > 0) {
              if (item.subItems.some((subItem) => selectedItemIds.includes(subItem.id))) {
                parentIds.add(item.id);
                collectParentIds(item.subItems, selectedItemIds, parentIds);
              }
            }
          });
          return parentIds;
        };

        const selectedItemIds = clonedItems.map((item) => item.id);
        const parentIds = collectParentIds(customer.inventory || initialInventoryData, selectedItemIds);
        expandedItemIds.add(...parentIds);

        // Fix: Properly handle multi-page templates
        const clonedFrontPages = quotation.frontPages 
          ? [...quotation.frontPages] 
          : (quotation.front_page 
              ? [{ 
                  title: quotation.front_page.title || 'QUOTATION', 
                  content: quotation.front_page.content || `Prepared for: ${quotation.customer_name || ''}` 
                }]
              : [{ title: 'QUOTATION', content: `Prepared for: ${quotation.customer_name || ''}` }]
            );

        const clonedBackPages = quotation.backPages 
          ? [...quotation.backPages] 
          : (quotation.back_page 
              ? [{ 
                  title: quotation.back_page.title || 'TERMS & CONDITIONS', 
                  content: quotation.back_page.content || '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.' 
                }]
              : [{ title: 'TERMS & CONDITIONS', content: '1. Payment due within 30 days.\n2. Prices valid for 60 days.\n3. Installation not included unless specified.' }]
            );

        const clonedQuotation = {
          ...quotation,
          id: null,
          quotation_number: `QTN-CLONE-${Date.now()}`,
          status: 'draft',
          pdfPath: null,
          is_resubmission: 0,
          parent_quotation_number: null,
          parent_chain: [],
          date: new Date().toISOString().split('T')[0],
          items: clonedItems,
          frontPages: clonedFrontPages,
          backPages: clonedBackPages,
          attachments: [],
          phone: customer.phone || '',
          email: customer.email || '',
          location: customer.location || '',
          cc_emails: [],
          send_via_whatsapp: false,
          isCloned: true,
        };

        setSelectedCustomer(customer);
        setCustomerSearchTerm(customer.name || '');
        setInventoryData(customer.inventory || initialInventoryData);
        setSelectedItems(clonedItems);
        setExpandedRows(expandedItemIds);
        setFrontPages(clonedFrontPages);
        setBackPages(clonedBackPages);
        setActiveFrontPageIndex(0);
        setActiveBackPageIndex(0);
        setEditingQuotation(clonedQuotation);
        setActivePage('create');
        setSuccessMessage('Quotation cloned successfully. Please review and save.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error cloning quotation:', error);
        setErrorMessage('Failed to clone quotation.');
        setTimeout(() => setErrorMessage(null), 5000);
      } finally {
        setLoading(quotation.id, 'clone', false);
      }
    },
    [mockCustomers, initialInventoryData]
  );

    const handleDeleteQuotation = useCallback(
      async (id) => {
        if (window.confirm('Are you sure you want to delete this quotation?')) {
          setLoading(id, 'delete', true);
          try {
            await axios.delete(`/api/v1/quotations/delete/${id}`);
            fetchQuotations();
          } catch (error) {
            console.error('Error deleting quotation:', error);
            setErrorMessage('Failed to delete quotation.');
          } finally {
            setLoading(id, 'delete', false);
          }
        }
      },
      []
    );

    const handleActionClick = useCallback(
      (quoteId) => {
        setSelectedQuoteId(quoteId);
        setActionNotes('');
        setActionType('');
        setShowActionModal(true);
      },
      []
    );

    // const handleActionSubmit = useCallback(
    //   async () => {
    //     if (!actionType || !actionNotes.trim()) {
    //       setErrorMessage('Please select an action and provide notes.');
    //       return;
    //     }
    //     setLoading(selectedQuoteId, 'action', true);
    //     try {
    //       await axios.put(`/api/v1/quotations/${selectedQuoteId}/status`, {
    //         status: actionType.toLowerCase(),
    //         notes: actionNotes,
    //       });
    //       setShowActionModal(false);
    //       setActionNotes('');
    //       setActionType('');
    //       setSelectedQuoteId(null);
    //       fetchQuotations();
    //     } catch (error) {
    //       console.error('Error updating quotation status:', error);
    //       setErrorMessage('Failed to update quotation status. Please try again.');
    //     } finally {
    //       setLoading(selectedQuoteId, 'action', false);
    //     }
    //   },
    //   [actionType, actionNotes, selectedQuoteId]
    // );
    const handleActionSubmit = useCallback(
      async (ccEmails = [], includeWhatsApp = false) => { // Added new parameters
        if (!actionType) {
          setErrorMessage('Please select an action (Approve or Reject).');
          return;
        }
        setLoading(selectedQuoteId, 'action', true);
        try {
          await axios.put(`/api/v1/quotations/${selectedQuoteId}/status`, {
            status: actionType.toLowerCase(),
            notes: actionNotes,
            cc_emails: ccEmails, // Added CC emails
            whatsapp: includeWhatsApp, // Added WhatsApp flag
          });
          setShowActionModal(false);
          setActionNotes('');
          setActionType('');
          setSelectedQuoteId(null);
          fetchQuotations();
        } catch (error) {
          console.error('Error updating quotation status:', error);
          setErrorMessage('Failed to update quotation status. Please try again.');
        } finally {
          setLoading(selectedQuoteId, 'action', false);
        }
      },
      [actionType, actionNotes, selectedQuoteId]
    );

    const generateItemsPdf = async (quote) => {
      console.log("this is quotation list data",quote);
      setLoading(quote.id, 'boq', true);
      try {
        if (!quote.items || !Array.isArray(quote.items) || quote.items.length === 0) {
          console.warn('No items available to generate PDF for quotation:', quote.quotation_number);
          // setErrorMessage('No items available to generate items PDF.');
          setTimeout(() => {
            setErrorMessage(null); 
          }, 3000); 
          return;
        }
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Items List for Quotation ${quote.quotation_number || 'N/A'}`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Customer: ${quote.customer_name || 'N/A'}`, 14, 30);
        doc.text(`Project: ${quote.project_name || 'N/A'}`, 14, 36);
        doc.text(`Date: ${quote.date || new Date().toLocaleDateString()}`, 14, 42);
        doc.setFontSize(14);
        doc.text('Items:', 14, 52);
        let yPos = 62;
        doc.setFontSize(10);
        quote.items.forEach((item, index) => {
          const name = item.name || 'Unnamed Item';
          const qty = item.qty || 1;
          const price = item.price ? item.price.toFixed(2) : '0.00';
          const total = item.qty && item.price ? (item.qty * item.price).toFixed(2) : '0.00';
          doc.text(`${index + 1}. ${name}`, 14, yPos);
          doc.text(`Qty: ${qty}`, 100, yPos);
          doc.text(`Unit Price: $${price}`, 130, yPos);
          doc.text(`Total: $${total}`, 170, yPos);
          yPos += 10;
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
        const pdfBlob = doc.output('blob');
        const formData = new FormData();
        formData.append('pdf', pdfBlob, `items_${quote.customer_name || 'unknown'}_${quote.quotation_number || 'unknown'}.pdf`);
        formData.append('quotation_id', quote.id || '');
        formData.append('customer_name', quote.customer_name || 'N/A');
        formData.append('quotation_number', quote.quotation_number || 'N/A');
        const response = await axios.post('/api/v1/quotations/save-items-pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Items PDF saved:', response.data);
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `items_${quote.customer_name || 'unknown'}_${quote.quotation_number || 'unknown'}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating or saving items PDF:', error);
        setErrorMessage('Failed to generate or save items PDF. Please try again.');
      } finally {
        setLoading(quote.id, 'boq', false);
      }
    };

    const handleDownloadQuotation = async (quote) => {
      setLoading(quote.id, 'download', true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const link = document.createElement('a');
        link.href = `http://127.0.0.1:8000/storage/${quote.pdfPath}`;
        link.download = `quotation_${quote.customer_name}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading quotation PDF:', error);
        setErrorMessage('Failed to download quotation PDF.');
      } finally {
        setLoading(quote.id, 'download', false);
      }
    };

    const handleModalClose = useCallback(() => {
      setShowActionModal(false);
      setActionNotes('');
      setActionType('');
      setSelectedQuoteId(null);
    }, []);

    return (
      // <div className="dashboard-card mt-4">
      <div>
        <div className="card-header bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">
              <i className="fas fa-list me-2"></i> Quotation List
            </h3>
            <div className="d-flex gap-2">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search quotations..."
                  value={searchQuoteTerm}
                  onChange={handleQuoteSearchChange}
                  ref={quoteSearchRef}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingQuotation(null);
                  setActivePage('create');
                }}
              >
                <i className="fas fa-plus me-2"></i> New Quotation
              </button>
            </div>
          </div>
        </div>
        <div className="stats-summary">
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary-subtle p-3 rounded me-3">
                      <i className="fas fa-file-invoice fs-2 text-primary"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Quotations</h5>
                      <h3 className="mb-0">{quotations.length}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-success-subtle p-3 rounded me-3">
                      <i className="fas fa-check-circle fs-2 text-success"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Approved</h5>
                      <h3 className="mb-0">{quotations.filter((q) => q.status.toLowerCase() === 'approved').length}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning-subtle p-3 rounded me-3">
                      <i className="fas fa-clock fs-2 text-warning"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Pending</h5>
                      <h3 className="mb-0">{quotations.filter((q) => q.status.toLowerCase() === 'pending').length}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger-subtle p-3 rounded me-3">
                      <i className="fas fa-times-circle fs-2 text-danger"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">Rejected</h5>
                      <h3 className="mb-0">{quotations.filter((q) => q.status.toLowerCase() === 'rejected').length}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Quotation ID</th>
                  <th>Customer</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Resubmission</th>
                  <th>Parent Quotation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((quote) => {
                  const parentQuotationNumbers = Array.from(
                    new Set([
                      quote.parent_quotation_number,
                      ...(quote.parent_chain || []).map((parent) => parent.quotation_number),
                    ].filter(Boolean))
                  ).join(', ');
                  const isLoading = loadingStates[quote.id] || {};
                  const isParentWithPendingResubmission = hasPendingResubmission(quote.quotation_number);

                  return (
                    <tr key={quote.id}>
                      <td>{quote.quotation_number}</td>
                      <td>{quote.customer_name}</td>
                      <td>{quote.project_name || '-'}</td>
                      <td>${quote.total_amount.toLocaleString()}</td>
                      <td>{quote.date}</td>
                      <td>
                        <span
                          className={`badge ${
                            quote.status.toLowerCase() === 'approved'
                              ? 'bg-success'
                              : quote.status.toLowerCase() === 'pending'
                              ? 'bg-warning'
                              : quote.status.toLowerCase() === 'rejected'
                              ? 'bg-danger'
                              : 'bg-secondary'
                          }`}
                        >
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </span>
                      </td>
                      <td>{quote.is_resubmission ? 'Yes' : 'No'}</td>
                      <td>{parentQuotationNumbers || '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {quote.status.toLowerCase() === 'rejected' && !isParentWithPendingResubmission && (
                            <>
                             {isLoading.edit ? (
                              <button className="btn btn-sm btn-outline-primary" disabled style={{ width: '32px', height: '32px' }}>
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditQuotation(quote)}
                                title="Revise Submission"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              )}
                            </>
                          )}
                          {quote.status.toLowerCase() === 'rejected' && isParentWithPendingResubmission && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              disabled
                              title="Cannot revise: A pending resubmission exists."
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {isLoading.clone ? (
                            <button className="btn btn-sm btn-outline-info" disabled style={{ width: '32px', height: '32px' }}>
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleCloneQuotation(quote)}
                              title="Clone Quotation"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          )}

                          {isLoading.delete ? (
                            <button className="btn btn-sm btn-outline-danger" disabled style={{ width: '32px', height: '32px' }}>
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteQuotation(quote.id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}

                          {isLoading.download ? (
                            <button className="btn btn-sm btn-outline-success" disabled style={{ width: '32px', height: '32px' }}>
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleDownloadQuotation(quote)}
                              disabled={!quote.pdfPath}
                              title="Download Quotation PDF"
                            >
                              <i className="fas fa-download"></i>
                            </button>
                          )}

                          {isLoading.boq ? (
                            <button className="btn btn-sm btn-outline-info" disabled style={{ width: '32px', height: '32px' }}>
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => generateItemsPdf(quote)}
                              disabled={!quote.items || quote.items.length === 0}
                              title="Download BOQ"
                            >
                              <i className="fas fa-file-pdf"></i>
                            </button>
                          )}
                          {quote.status.toLowerCase() === 'pending' && (
                            <>
                              {isLoading.action ? (
                                <button className="btn btn-sm btn-outline-warning" disabled style={{ width: '32px', height: '32px' }}>
                                  <span className="spinner-border spinner-border-sm" role="status"></span>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => handleActionClick(quote.id)}
                                  title="Action"
                                >
                                  <i className="fas fa-cog"></i>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <ActionModal
          isOpen={showActionModal}
          onClose={handleModalClose}
          actionType={actionType}
          setActionType={setActionType}
          actionNotes={actionNotes}
          setActionNotes={setActionNotes}
          onSubmit={handleActionSubmit}
          notesRef={notesTextareaRef}
          mockCustomers={mockCustomers} 
        />
      </div>
    );
  });

  const filteredQuotations = useMemo(() => {
    return quotations.filter(
      (quote) =>
        quote.customer_name.toLowerCase().includes(searchQuoteTerm.toLowerCase()) ||
        (quote.project_name && quote.project_name.toLowerCase().includes(searchQuoteTerm.toLowerCase()))
    );
  }, [quotations, searchQuoteTerm]);

  const selectedCount = selectedItems.length;

 
   
return (
  <div className="">
    {/* Main Content Container */}
    <div className="main-content">
      {/* Header Section */}
      <div className="header">
        <ul className="nav nav-tabs header-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activePage === 'list' ? 'active' : ''}`}
              onClick={() => setActivePage('list')}
            >
              <i className="fas fa-list me-2"></i> Quotation List
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activePage === 'create' ? 'active' : ''}`}
              onClick={() => setActivePage('create')}
            >
              <i className="fas fa-file-invoice me-2"></i> Create New Quotation
            </button>
          </li>
        </ul>
        {/* <div className="user-menu">
          <div className="user-info">
            <div className="name">Alex Morgan</div>
            <div className="role">Sales Manager</div>
          </div>
          <div className="avatar">AM</div>
        </div> */}
      </div>

      {/* Status Messages */}
      {errorMessage && (
        <div className="alert alert-danger mt-4 d-flex align-items-center" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          <div>{errorMessage}</div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setErrorMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success mt-4" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {/* Page Content */}
      {activePage === 'list' ? (
        <QuotationList />
      ) : (
        <>
          <div className="dashboard-card mt-4">
            <ul className="nav nav-tabs" id="quotationTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <i className="fas fa-info-circle me-2"></i> Quotation Details
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  <i className="fas fa-boxes me-2"></i> Inventory Selection
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'selected' ? 'active' : ''}`}
                  onClick={() => setActiveTab('selected')}
                >
                  <i className="fas fa-list-check me-2"></i> Selected Items
                  <span className="badge bg-primary ms-2">
                    {selectedCount} item{selectedCount !== 1 ? 's' : ''}
                  </span>
                </button>
              </li>
            </ul>
            
            <div className="tab-content p-3" style={{ display: 'block' }}>
              {/* Details Tab */}
              <div className={`tab-pane ${activeTab === 'details' ? 'show active' : ''}`}>
                <div className="row g-4 p-3 rounded bg-white" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                  {/* Customer Search */}
                  <div className="col-md-4 position-relative">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Customer <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="input-group" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                      <input
                        type="text"
                        className="form-control border-primary-subtle"
                        placeholder="Search customers..."
                        value={customerSearchTerm}
                        onChange={handleCustomerSearchChange}
                        ref={customerSearchRef}
                      />
                      {!selectedCustomer && customerSearchTerm && (
                        <div className="text-danger small mt-1">Please select a customer from the list</div>
                      )}
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-search"></i>
                      </button>
                      {selectedCustomer && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={clearCustomerSelection}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                    {filteredCustomers.length > 0 && (
                      <div className="customer-dropdown position-absolute z-10 bg-white mt-1 w-100">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className="p-2 border-bottom"
                            onClick={() => handleCustomerSelect(customer)}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: '#fff',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                          >
                            <div className="fw-bold">{customer.name}</div>
                            <small className="text-muted">
                              {customer.contactPerson} • {customer.type}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Estimate Type */}
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Estimate Type <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      className="form-select border-primary-subtle"
                      required
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    >
                      <option value="">Select Type</option>
                      <option>Project</option>
                      <option>Service</option>
                      <option>Product</option>
                    </select>
                  </div>
                  
                  {/* Customer Type */}
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Customer Type <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      className="form-select border-primary-subtle"
                      value={selectedCustomerType}
                      onChange={(e) => setSelectedCustomerType(e.target.value)}
                      required
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    >
                      <option value="">Select an option</option>
                      <option value="New">New</option>
                      <option value="Existing">Existing</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  
                  {/* CC Emails */}
                  <div className="col-md-4 position-relative">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      CC Email(s)
                    </label>
                    <div className="input-group" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                      <input
                        type="text"
                        className="form-control border-primary-subtle"
                        placeholder="Search customers to add CC..."
                        value={ccSearchTerm}
                        onChange={handleCcSearchChange}
                        ref={ccSearchRef}
                      />
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                    {filteredCcCustomers.length > 0 && (
                      <div className="customer-dropdown position-absolute z-10 bg-white mt-1 w-100">
                        {filteredCcCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className="p-2 border-bottom"
                            onClick={() => handleCcSelect(customer)}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: '#fff',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                          >
                            <div className="fw-bold">{customer.name}</div>
                            <small className="text-muted">
                              {customer.email || 'No email'} • {customer.contactPerson}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedCcEmails.length > 0 && (
                      <div className="mt-2">
                        {selectedCcEmails.map((email, index) => (
                          <div
                            key={index}
                            className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                          >
                            {email}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              onClick={() => removeCcEmail(email)}
                              aria-label="Remove"
                            ></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Person */}
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Contact Person
                    </label>
                    <input
                      type="text"
                      className="form-control border-secondary-subtle"
                      value={selectedCustomer?.contactPerson || ''}
                      readOnly
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Project Name */}
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Project Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control border-secondary-subtle"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                    {!projectName.trim() && (
                      <div className="text-danger small mt-1">Project name is required</div>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Phone No
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Client Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Date */}
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Date <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Estimate No */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Estimate No <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={`EST-${Math.floor(Math.random() * 10000)}`}
                      readOnly
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Location */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Venue */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Venue
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Main Office"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Sales Person */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Sales Person
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Alex Morgan"
                      readOnly
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Status */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Status
                    </label>
                    <select
                      className="form-select border-warning-subtle"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  {/* Start Date */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* End Date */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Setup Date */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Set up Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={setupDate}
                      onChange={(e) => setSetupDate(e.target.value)}
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                  
                  {/* Packup Date */}
                  <div className="col-md-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Pack up Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={packupDate}
                      onChange={(e) => setPackupDate(e.target.value)}
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-primary" disabled>
                    <i className="fas fa-arrow-left me-2"></i> Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('inventory')}
                  >
                    Next <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
              
              {/* Inventory Selection Tab */}
              <div className={`tab-pane ${activeTab === 'inventory' ? 'show active' : ''}`}>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="dashboard-card h-100">
                      <div className="card-body">
                        <div className="search-container mb-3 d-flex align-items-center gap-2">
                          <div className="search-box d-flex align-items-center">
                            <i className="fas fa-search"></i>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search inventory items..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <select
                            className="form-select"
                            style={{ maxWidth: '200px' }}
                            value={vendorFilter}
                            onChange={(e) => setVendorFilter(e.target.value)}
                          >
                            <option value="">All Vendors</option>
                            <option>Vendor A</option>
                            <option>Vendor B</option>
                            <option>Vendor C</option>
                            <option>Vendor D</option>
                            <option>Vendor E</option>
                            <option>Vendor F</option>
                            <option>Vendor G</option>
                          </select>
                          <div className="d-flex gap-2 ms-auto">
                            <button className="btn btn-sm btn-outline-primary" onClick={expandAll}>
                              <i className="fas fa-expand"></i> Expand All
                            </button>
                            <button className="btn btn-sm btn-outline-primary" onClick={collapseAll}>
                              <i className="fas fa-compress"></i> Collapse All
                            </button>
                          </div>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              onChange={handleSelectAll}
                              checked={
                                (() => {
                                  const allIds = [];
                                  const collectIds = (items) => {
                                    items.forEach((item) => {
                                      if (rowMatchesFilter(item)) {
                                        allIds.push(item.id);
                                        if (item.subItems && item.subItems.length > 0 && expandedRows.has(item.id)) {
                                          collectIds(item.subItems);
                                        }
                                      }
                                    });
                                  };
                                  collectIds(inventoryData);
                                  if (allIds.length === 0) return false;
                                  return allIds.every((id) => selectedItems.some((si) => si.id === id));
                                })()
                              }
                            />
                            <label className="form-check-label">Select All</label>
                          </div>
                        </div>
                        
                        <div className="table-responsive">
                          <table className="table tree-table table-hover">
                            <thead className="table-light">
                              <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>Inventory Item</th>
                                <th>Available</th>
                                <th>Quantity</th>
                                <th>Days</th>
                                <th>Vendor</th>
                                <th>Unit Price</th>
                              </tr>
                            </thead>
                            <tbody>{renderInventoryRows(inventoryData)}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="summary-card-quoatation">
                      <h3 className="mb-4">
                        <i className="fas fa-receipt me-2"></i> Quotation Summary
                      </h3>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Discount (5%):</span>
                        <span>${discount.toFixed(2)}</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Shipping:</span>
                        <span>${expressShipping ? 125 : 75}.00</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Total:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="mt-4">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="includeSetup"
                            checked={includeSetup}
                            onChange={(e) => setIncludeSetup(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="includeSetup">
                            Include setup fee ($150)
                            <span style={{ color: includeSetup ? 'green' : 'red', marginLeft: '5px' }}>
                              {includeSetup ? '✓ Included' : '✗ Not Included'}
                            </span>
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="expressShipping"
                            checked={expressShipping}
                            onChange={(e) => setExpressShipping(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="expressShipping">
                            Express shipping (+$50)
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sendViaWhatsApp"
                            checked={sendViaWhatsApp}
                            onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="sendViaWhatsApp">
                            Send via WhatsApp
                            <span style={{ color: sendViaWhatsApp ? 'green' : 'red', marginLeft: '5px' }}>
                              {sendViaWhatsApp ? '✓ Enabled' : '✗ Disabled'}
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          className="btn btn-primary w-100 mb-3"
                          onClick={handleGeneratePdf}
                          disabled={isGeneratingPdf || !selectedCustomer || !projectName.trim() || selectedItems.length === 0}
                        >
                          {isGeneratingPdf ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Generating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-file-pdf me-2"></i> Generate PDF
                            </>
                          )}
                        </button>
                        
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary flex-grow-1"
                            onClick={toggleCustomization}
                          >
                            <i className="fas fa-cog me-2"></i> Customize PDF
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => setShowTemplateModal(true)}
                          >
                            <i className="fas fa-save"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setActiveTab('details')}
                  >
                    <i className="fas fa-arrow-left me-2"></i> Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('selected')}
                  >
                    Next <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
              
              {/* Selected Items Tab */}
              <div className={`tab-pane ${activeTab === 'selected' ? 'show active' : ''}`}>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="dashboard-card h-100">
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table selected-items-table">
                            <thead>
                              <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedItems.map((si) => {
                                const total = (si.qty * si.price).toFixed(2);
                                return (
                                  <tr key={si.id}>
                                    <td>{si.name}</td>
                                    <td>
                                      <input
                                        type="number"
                                        className="form-control qty-update"
                                        min="1"
                                        max={si.available}
                                        value={si.qty}
                                        onChange={(e) => handleQtyChangeSelected(si.id, e.target.value)}
                                        style={{ maxWidth: '80px' }}
                                      />
                                    </td>
                                    <td>{si.price ? si.price.toFixed(2) : '0.00'}</td>

                                    <td>${total}</td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-danger remove-item"
                                        onClick={() => removeSelectedItem(si.id)}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="3" className="text-end fw-bold">
                                  Subtotal
                                </td>
                                <td>${subtotal.toFixed(2)}</td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="summary-card-quoatation">
                      <h3 className="mb-4">
                        <i className="fas fa-receipt me-2"></i> Quotation Summary
                      </h3>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Discount (5%):</span>
                        <span>${discount.toFixed(2)}</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Shipping:</span>
                        <span>${expressShipping ? 125 : 75}.00</span>
                      </div>
                      <div className="summary-item d-flex justify-content-between">
                        <span>Total:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="mt-4">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="includeSetup"
                            checked={includeSetup}
                            onChange={(e) => setIncludeSetup(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="includeSetup">
                            Include setup fee ($150)
                            <span style={{ color: includeSetup ? 'green' : 'red', marginLeft: '5px' }}>
                              {includeSetup ? '✓ Included' : '✗ Not Included'}
                            </span>
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="expressShipping"
                            checked={expressShipping}
                            onChange={(e) => setExpressShipping(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="expressShipping">
                            Express shipping (+$50)
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sendViaWhatsApp"
                            checked={sendViaWhatsApp}
                            onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="sendViaWhatsApp">
                            Send via WhatsApp
                            <span style={{ color: sendViaWhatsApp ? 'green' : 'red', marginLeft: '5px' }}>
                              {sendViaWhatsApp ? '✓ Enabled' : '✗ Disabled'}
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          className="btn btn-primary w-100 mb-3"
                          onClick={handleGeneratePdf}
                          disabled={isGeneratingPdf || !selectedCustomer || !projectName.trim() || selectedItems.length === 0}
                        >
                          {isGeneratingPdf ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Generating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-file-pdf me-2"></i> Generate PDF
                            </>
                          )}
                        </button>
                        
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary flex-grow-1"
                            onClick={toggleCustomization}
                          >
                            <i className="fas fa-cog me-2"></i> Customize PDF
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => setShowTemplateModal(true)}
                          >
                            <i className="fas fa-save"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {customizationOpen && (
                  <div className="customization-panel mt-4">
                    {/* Template Management */}
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4>Template Management</h4>
                          <div>
                            {currentTemplate && (
                              <span className="me-3">
                                Current: <strong>{currentTemplate.name}</strong>
                              </span>
                            )}
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setShowTemplateModal(true)}
                            >
                              <i className="fas fa-save me-1"></i>
                              Manage Templates
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Front Pages */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="dashboard-card">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h4>Front Pages</h4>
                            <div>
                              <button 
                                className="btn btn-sm btn-success me-2"
                                onClick={addFrontPage}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                              <div className="btn-group">
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  disabled={activeFrontPageIndex === 0}
                                  onClick={() => setActiveFrontPageIndex(prev => prev - 1)}
                                >
                                  <i className="fas fa-chevron-left"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-secondary disabled">
                                  {activeFrontPageIndex + 1} / {frontPages.length}
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  disabled={activeFrontPageIndex === frontPages.length - 1}
                                  onClick={() => setActiveFrontPageIndex(prev => prev + 1)}
                                >
                                  <i className="fas fa-chevron-right"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                              <h5>Page {activeFrontPageIndex + 1}</h5>
                              <button 
                                className="btn btn-sm btn-danger"
                                disabled={frontPages.length <= 1}
                                onClick={() => removeFrontPage(activeFrontPageIndex)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                            
                            <div className="mb-3">
                              <label className="form-label">Title</label>
                              <input
                                type="text"
                                className="form-control"
                                value={frontPages[activeFrontPageIndex]?.title || ''}
                                onChange={(e) => handleFrontPageChange(activeFrontPageIndex, 'title', e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Content</label>
                              <textarea
                                className="form-control"
                                rows="6"
                                value={frontPages[activeFrontPageIndex]?.content || ''}
                                onChange={(e) => handleFrontPageChange(activeFrontPageIndex, 'content', e.target.value)}
                              ></textarea>
                            </div>
                            
                            {/* Front Page Attachments */}
                            <div className="mb-3">
                              <label className="form-label">Page Attachments</label>
                              <input
                                type="file"
                                className="form-control"
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                onChange={(e) => handlePageAttachmentChange('front', activeFrontPageIndex, e)}
                              />
                              <div className="attachment-previews d-flex flex-wrap gap-2 mt-2">
                                {frontPages[activeFrontPageIndex]?.attachments?.map((attachment, idx) => (
                                  <div key={idx} className="attachment-preview position-relative">
                                    {attachment.type.startsWith('image/') ? (
                                      <img
                                        src={attachment.url}
                                        alt={`Attachment ${idx + 1}`}
                                        className="img-thumbnail"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div className="document-preview">
                                        <i className="fas fa-file-pdf text-danger fa-3x"></i>
                                        <div className="document-name small">{attachment.name}</div>
                                      </div>
                                    )}
                                    <button
                                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                      onClick={() => removePageAttachment('front', activeFrontPageIndex, idx)}
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Back Pages */}
                      <div className="col-md-6">
                        <div className="dashboard-card">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h4>Back Pages</h4>
                            <div>
                              <button 
                                className="btn btn-sm btn-success me-2"
                                onClick={addBackPage}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                              <div className="btn-group">
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  disabled={activeBackPageIndex === 0}
                                  onClick={() => setActiveBackPageIndex(prev => prev - 1)}
                                >
                                  <i className="fas fa-chevron-left"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-secondary disabled">
                                  {activeBackPageIndex + 1} / {backPages.length}
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  disabled={activeBackPageIndex === backPages.length - 1}
                                  onClick={() => setActiveBackPageIndex(prev => prev + 1)}
                                >
                                  <i className="fas fa-chevron-right"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                              <h5>Page {activeBackPageIndex + 1}</h5>
                              <button 
                                className="btn btn-sm btn-danger"
                                disabled={backPages.length <= 1}
                                onClick={() => removeBackPage(activeBackPageIndex)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                            
                            <div className="mb-3">
                              <label className="form-label">Title</label>
                              <input
                                type="text"
                                className="form-control"
                                value={backPages[activeBackPageIndex]?.title || ''}
                                onChange={(e) => handleBackPageChange(activeBackPageIndex, 'title', e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Content</label>
                              <textarea
                                className="form-control"
                                rows="6"
                                value={backPages[activeBackPageIndex]?.content || ''}
                                onChange={(e) => handleBackPageChange(activeBackPageIndex, 'content', e.target.value)}
                              ></textarea>
                            </div>
                            
                            {/* Back Page Attachments */}
                            <div className="mb-3">
                              <label className="form-label">Page Attachments</label>
                              <input
                                type="file"
                                className="form-control"
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                onChange={(e) => handlePageAttachmentChange('back', activeBackPageIndex, e)}
                              />
                              <div className="attachment-previews d-flex flex-wrap gap-2 mt-2">
                                {backPages[activeBackPageIndex]?.attachments?.map((attachment, idx) => (
                                  <div key={idx} className="attachment-preview position-relative">
                                    {attachment.type.startsWith('image/') ? (
                                      <img
                                        src={attachment.url}
                                        alt={`Attachment ${idx + 1}`}
                                        className="img-thumbnail"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div className="document-preview">
                                        <i className="fas fa-file-pdf text-danger fa-3x"></i>
                                        <div className="document-name small">{attachment.name}</div>
                                      </div>
                                    )}
                                    <button
                                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                      onClick={() => removePageAttachment('back', activeBackPageIndex, idx)}
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <i className="fas fa-arrow-left me-2"></i> Back
                  </button>
                  <button className="btn btn-primary" disabled>
                    Next <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    
    {/* Template Modal */}
    <TemplateModal 
      isOpen={showTemplateModal}
      onClose={() => setShowTemplateModal(false)}
      templates={templates}
      onSave={saveTemplate}
      onLoad={loadTemplate}
      onDelete={async (id) => {
        try {
          await axios.delete(`/api/v1/templates/${id}`);
          setSuccessMessage('Template deleted successfully');
          fetchTemplates();
        } catch (error) {
          setErrorMessage('Failed to delete template');
        }
      }}
    />
  </div>
);

}

export default Quotation;