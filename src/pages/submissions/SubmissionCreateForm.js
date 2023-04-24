import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Button, InputGroup } from "react-bootstrap";
import { axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";

const SubmissionCreateForm = (props) => {
  const { dare, setDares, setNewSubmission, profileImage, profile_id } = props;
  const [text, setText] = useState("");
  const [uploads, setUploads] = useState([]);


  return (
    <Row>
      <Col>
        <Form onSubmit={() => {}}>
          <Row>
            <Col>
              <Container>
                <Form.Group>
                  <InputGroup>
                    <Link to={`/profiles/${profile_id}`}>
                      <Avatar src={profileImage} />
                    </Link>
                    <Form.Control
                      placeholder="Write additional info and context to uploaded proof"
                      as="textarea"
                      value={text}
                      onChange={handleChange}
                      rows={2}
                    />
                  </InputGroup>
                </Form.Group>
                <div className="d-md-none">Upload area small</div>
              </Container>
            </Col>
            <Col md={5} lg={4} className="d-none d-md-block">
              <div className="d-none d-md-block">Upload area</div>
            </Col>
          </Row>
          <div className="m-3">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default SubmissionCreateForm;
