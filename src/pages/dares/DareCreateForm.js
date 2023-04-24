import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import TagField from "../../components/TagField";
import appStyles from "../../App.module.css";

function DareCreateForm() {
  const [errors, setErrors] = useState({});
  const [criteriaFields, setCriteriaFields] = useState([{ id: 0, text: "" }]);

  const [dareData, setDareData] = useState({
    title: "",
    description: "",
    category: "",
    criteria: [],
    tags: [],
  });

  const { title, description, category, criteria, tags } = dareData;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setDareData({
      ...dareData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagsChange = (newTags) => {
    setDareData({
      ...dareData,
      tags: newTags,
    });
  };

  const handleMinusCriteria = (id) => {
    if (criteriaFields.length > 1) {
      const newCriteriaList = criteriaFields.filter(
        (criteria) => criteria.id !== id
      );

      const newCriteriaData = [...criteria];
      newCriteriaData.splice(id, 1);
      setDareData({ ...dareData, criteria: newCriteriaData });

      const updateIndex = newCriteriaList.map((field, index) => {
        return { ...field, id: index };
      });
      setCriteriaFields(updateIndex);
    }
  };

  const handlePlusCriteria = () => {
    if (criteriaFields.length < 8) {
      const criteriaList = [...criteriaFields];
      const id = criteriaList[criteriaList.length - 1].id + 1;
      criteriaList.push({ id, text: "" });
      setCriteriaFields(criteriaList);

      const newCriteriaData = [...criteria];
      newCriteriaData.push("");
      setDareData({ ...dareData, criteria: newCriteriaData });
    }
  };

  const handleCriterionChange = (id, text) => {
    const newCriteria = [...criteriaFields];
    newCriteria[id].text = text;
    setCriteriaFields(newCriteria);

    const newCriteriaData = [...criteria];
    newCriteriaData[id] = text;
    setDareData({ ...dareData, criteria: newCriteriaData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const challengeData = new FormData();

    challengeData.append("title", title);
    challengeData.append("description", description);
    challengeData.append("category", category);
    const tagsText = tags.map((tag) => tag.text);
    challengeData.append("tags", tagsText);
    console.log(tagsText);

    try {
      const { data } = await axiosReq.post("/challenges/", challengeData);

      const criteriaData = [];
      criteria.forEach((criterion) => {
        const formData = new FormData();
        formData.append("challenge", data.id);
        formData.append("text", criterion);
        criteriaData.push(formData);
      });

      await Promise.all(
        criteriaData.map((formData) => axiosReq.post("/criteria/", formData))
      );

      navigate(`/dares/${data.id}`);
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

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
        <TagField
          placeholder="Press tab to add tag"
          name="tags"
          tags={tags}
          onChange={handleTagsChange}
        />
      </Form.Group>

      {errors.tags?.map((message, idx) => (
        <Alert variant="light" key={idx}>
          {message}
        </Alert>
      ))}
    </div>
  );

  const renderCriteriaFields = (
    <div>
      <Form.Group>
        <Form.Label>Criteria</Form.Label>

        {criteriaFields.map((field) => (
          <InputGroup key={`${field.id}`} className="mb-3">
            <Form.Control
              type="text"
              placeholder="What has to be done?"
              value={field.text}
              onChange={(e) => handleCriterionChange(field.id, e.target.value)}
            />
            <Button onClick={() => handleMinusCriteria(field.id)}>-</Button>
          </InputGroup>
        ))}
      </Form.Group>
      <div className="text-center">
        <Button onClick={handlePlusCriteria}>+</Button>
      </div>
    </div>
  );

  return (
    <Row>
      <h1 className={appStyles.BrandFont}>Dares / Create</h1>
      <Col md={9}>
        <Row className="d-block d-md-none">Top Bar</Row>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Container>
                <div>{textFields}</div>
                <div className="d-md-none">{renderCriteriaFields}</div>
              </Container>
            </Col>
            <Col md={5} lg={4} className="d-none d-md-block">
              <div className="d-none d-md-block">{renderCriteriaFields}</div>
            </Col>
          </Row>
          <div className="m-3">
            <Button type="submit">create</Button>
            <Button onClick={() => navigate(-1)}>cancel</Button>
          </div>
        </Form>
      </Col>
      <Col md={3} className="d-none d-md-block">
        <Row>
          <Container className={`${appStyles.Box} pb-1 mb-2`}>
            <div>
              <h5 className="mb-0 mt-1">
                <i className="fa-solid fa-fire-flame-curved"></i> Dares
              </h5>
            </div>
            <hr className="m-1"></hr>
            <div className="d-flex flex-column"></div>
          </Container>
        </Row>
        <Row>
          <Container className={`${appStyles.Box} pb-1 mb-2`}>
            <div>
              <h5 className="mb-0 mt-1">
                <i className="fa-solid fa-fire-flame-curved"></i> Profiles
              </h5>
            </div>
            <hr className="m-1"></hr>
            <div className="d-flex flex-column"></div>
          </Container>
        </Row>
      </Col>
    </Row>
  );
}

export default DareCreateForm;
