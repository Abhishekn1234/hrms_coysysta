import { Row, Col, Form } from 'react-bootstrap';

export default function FinancialHR({ data, setData }) {
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
              value={data.daily_remuneration}
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
              value={data.rent_allowance_percent}
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
              value={data.casual_leaves}
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
              value={data.esi_card_no}
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
              value={data.pf_no}
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
            value={data.covid_vaccinated}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
          </Form.Select>
        </Form.Group>

        </Col>
      </Row>
    </Form>
  );
}