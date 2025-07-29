import { Row, Col, Form } from 'react-bootstrap';

export default function FinancialHRs({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Daily Remuneration</Form.Label>
            <Form.Control
              type="number"
              name="dailyRemuneration"
              value={data.dailyRemuneration}
              onChange={handleChange}
              placeholder="Enter daily remuneration"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Rent Allowance %</Form.Label>
            <Form.Control
              type="number"
              name="rentAllowance"
              value={data.rentAllowance}
              onChange={handleChange}
              placeholder="Enter allowance percentage"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>No. Of Casual Leaves</Form.Label>
            <Form.Control
              type="number"
              name="casualLeaves"
              value={data.casualLeaves}
              onChange={handleChange}
              placeholder="Enter no. of casual leaves"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>ESI Card No.</Form.Label>
            <Form.Control
              type="text"
              name="esiCardNo"
              value={data.esiCardNo}
              onChange={handleChange}
              placeholder="Enter ESI card number"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>PF No.</Form.Label>
            <Form.Control
              type="text"
              name="pfNo"
              value={data.pfNo}
              onChange={handleChange}
              placeholder="Enter PF number"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
          <Form.Label>COVID-19 Vaccinated</Form.Label>
          <Form.Select
            name="vaccinated"
            value={data.vaccinated}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </Form.Select>
        </Form.Group>

        </Col>
      </Row>
    </Form>
  );
}