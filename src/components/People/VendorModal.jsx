import { useState } from "react";
import { Modal, Form, Accordion, Button, Row, Col } from "react-bootstrap";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

// Custom Toggle for Accordion
function CustomAccordionToggle({ children, eventKey }) {
  const [open, setOpen] = useState(false);
  const decoratedOnClick = Accordion.useAccordionButton(eventKey, () => {
    setOpen(!open);
  });

  return (
    <div
      onClick={decoratedOnClick}
      className="d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded"
      style={{ cursor: "pointer" }}
    >
      <strong>{children}</strong>
      {open ? <FaChevronDown /> : <FaChevronRight />}
    </div>
  );
}

export default function VendorModal({ showVendorModal, setShowVendorModal }) {
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [organization, setOrganization] = useState("");
  const [contacts, setContacts] = useState([
    { name: "", designation: "", email: "", phone: "" },
  ]);

  const addContact = () => {
    setContacts([...contacts, { name: "", designation: "", email: "", phone: "" }]);
  };

  const removeContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  return (
    <Modal show={showVendorModal} onHide={() => setShowVendorModal(false)} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add New Vendor</Modal.Title>
      </Modal.Header>

      <div className="d-flex justify-content-between align-items-center mb-4 bg-light rounded p-3">
        <div>
          <span className="fw-semibold">Login is enabled</span>
          <Form.Check
            type="switch"
            id="login-switch"
            checked={loginEnabled}
            onChange={(e) => setLoginEnabled(e.target.checked)}
            className="ms-3 d-inline-block"
          />
        </div>
        <div style={{ width: "50%" }}>
          <Form.Label className="fw-semibold">
            Organization <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select value={organization} onChange={(e) => setOrganization(e.target.value)}>
            <option value="">Select Organization</option>
            <option value="org1">Organization 1</option>
            <option value="org2">Organization 2</option>
          </Form.Select>
        </div>
      </div>

      <Modal.Body>
        <Accordion defaultActiveKey="0" alwaysOpen>
          {/* Vendor Details */}
          <Accordion.Item eventKey="0">
            <CustomAccordionToggle eventKey="0">Vendor Details</CustomAccordionToggle>
            <Accordion.Body>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Label>Salutation<span className="text-danger">*</span></Form.Label>
                  <Form.Select>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" />
                </Col>
                <Col md={3}>
                  <Form.Label>Phone<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" />
                </Col>
                <Col md={3}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>GST No.</Form.Label>
                  <Form.Control type="text" />
                </Col>
                <Col md={4}>
                  <Form.Label>Type<span className="text-danger">*</span></Form.Label>
                  <Form.Select>
                    <option>Material</option>
                    <option>Service</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows={1} />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          {/* Contact Persons */}
          <Accordion.Item eventKey="1">
            <CustomAccordionToggle eventKey="1">Contact Persons</CustomAccordionToggle>
            <Accordion.Body>
              {contacts.map((contact, index) => (
                <div key={index} className="mb-3 border rounded p-3">
                  <Row className="mb-2">
                    <Col md={6}>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, "name", e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Designation</Form.Label>
                      <Form.Control
                        type="text"
                        value={contact.designation}
                        onChange={(e) => handleContactChange(index, "designation", e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Label>Work Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(index, "email", e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Work Phone</Form.Label>
                      <Form.Control
                        type="text"
                        value={contact.phone}
                        onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                      />
                    </Col>
                  </Row>
                  {contacts.length > 1 && (
                    <div className="text-end mt-2">
                      <Button variant="danger" size="sm" onClick={() => removeContact(index)}>
                        Delete Row
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <div className="text-end">
                <Button variant="primary" size="sm" onClick={addContact}>
                  + Add Contact Person
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>
    </Modal>
  );
}
