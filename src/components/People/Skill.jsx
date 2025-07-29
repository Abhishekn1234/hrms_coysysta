import React from 'react';
import { Form } from 'react-bootstrap';

export default function Skill({ selectedSkills, setSelectedSkills }) {
  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSkills(options);
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Skills</Form.Label>
        <Form.Select
          multiple
          style={{ height: '150px' }}
          value={selectedSkills}
          onChange={handleChange}
        >
          <option>Client Service</option>
          <option>Sales</option>
          <option>Video Design</option>
          <option>Transportation</option>
          <option>Asst.Technician</option>
        </Form.Select>
        <Form.Text muted>
          Hold Ctrl/Cmd to select multiple.
        </Form.Text>
      </Form.Group>
    </Form>
  );
}