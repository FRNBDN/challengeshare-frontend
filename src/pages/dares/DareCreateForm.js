import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";

function DareCreateForm() {
  const textFields = (
    <div>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.title?.map((message, idx) => (
        <Alert variant="light" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          placeholder="Write the dare description"
          value={description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.description?.map((message, idx) => (
        <Alert variant="light" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Select
          aria-label="Select Category"
          name="category"
          value={category}
          onChange={handleChange}
        >
          <option>Select Category</option>
          <option value="Spiritual">Spiritual</option>
          <option value="Financial">Financial</option>
          <option value="Career">Career</option>
          <option value="Intellectual">Intellectual</option>
          <option value="Fitness">Fitness</option>
          <option value="Social">Social</option>
          <option value="Other">Other</option>
        </Form.Select>
      </Form.Group>
      {errors.category?.map((message, idx) => (
        <Alert variant="light" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Tags</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          name="tags"
          placeholder="Helps searchability of the dare"
          value={tags}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.category?.map((message, idx) => (
        <Alert variant="light" key={idx}>
          {message}
        </Alert>
      ))}
    </div>
  );

  return (
    <Form>
      <Row>
        <Col>
          <Container>
            <div>{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block">
        </Col>
      </Row>
      <div className="m-3">
        <Button type="submit">create</Button>
      </div>
    </Form>
  );
}

export default DareCreateForm;