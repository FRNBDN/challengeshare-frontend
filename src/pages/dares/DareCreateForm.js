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
import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";

import TopProfiles from "../profiles/TopProfiles";

function DareCreateForm() {
  const [errors, setErrors] = useState({});
  const [criteriaFields, setCriteriaFields] = useState([{ id: 0, text: "" }]);

  const [dareData, setDareData] = useState({
    title: "",
    description: "",
    category: "",
    criteria: [],
  });

  const { title, description, category, criteria } = dareData;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setDareData({
      ...dareData,
      [e.target.name]: e.target.value,
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
        <Form.Label className={appStyles.BrandFont}>Title</Form.Label>
        <Form.Control
          className={formStyles.Input}
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
        <Form.Label className={appStyles.BrandFont}>Description</Form.Label>
        <Form.Control
          className={formStyles.Input}
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
        <Form.Label className={appStyles.BrandFont}>Category</Form.Label>
        <Form.Select
          className={formStyles.Input}
          aria-label="Select Category"
          name="category"
          value={category}
          onChange={handleChange}
        >
          <option>Select Category</option>
          <option value="Positivity Spread">Random Acts of Kindness</option>
          <option value="Fitness">Fitness</option>
          <option value="Adventure">Adventure</option>
          <option value="Creativity">Creativity</option>
          <option value="Fitness">Fitness</option>
          <option value="Social">Social</option>
          <option value="Meme">Meme</option>
        </Form.Select>
      </Form.Group>
      {errors.category?.map((message, idx) => (
        <Alert variant="light" key={idx}>
          {message}
        </Alert>
      ))}
    </div>
  );

  const renderCriteriaFields = (
    <div>
      <Form.Group>
        <Form.Label className={appStyles.BrandFont}>
          Criteria ({criteriaFields.length}/5)
        </Form.Label>

        {criteriaFields.map((field) => (
          <InputGroup key={`${field.id}`} className="mb-3">
            <Form.Control
              className={formStyles.Input}
              type="text"
              placeholder="What has to be done?"
              value={field.text}
              onChange={(e) => handleCriterionChange(field.id, e.target.value)}
            />
            {criteriaFields.length > 1 && (
              <Button
                className={` ${appStyles.Button} `}
                onClick={() => handleMinusCriteria(field.id)}
              >
                -
              </Button>
            )}
          </InputGroup>
        ))}
      </Form.Group>
      {errors.field &&
        errors.field.text?.map((message, idx) => (
          <Alert variant="light" key={idx}>
            {message}
          </Alert>
        ))}
      {criteriaFields.length < 5 && (
        <div className="text-center">
          <Button
            onClick={handlePlusCriteria}
            className={` ${appStyles.Button} `}
          >
            +
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Row>
      <h1>
        <Link to="/dares">Dares</Link> / Create
      </h1>
      <Col md={9}>
        <TopProfiles mobile />
        <Form onSubmit={handleSubmit}>
          <Container className={`pt-2 pb-3 ${appStyles.Box}`}>
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
              <Button type="submit" className={`${appStyles.Button} `}>
                Create
              </Button>
              <span className="mx-2"> /</span>
              <Link onClick={() => navigate(-1)}>Cancel</Link>
            </div>
          </Container>
        </Form>
      </Col>
      <Col md={3} className="d-none d-md-block">
        <Row>
          <div className="d-flex flex-column px-0 pb-3 ">
            <Link
              to="/dares/create"
              className={`${appStyles.Button} m-0 flex-fill py-2`}
            >
              <h6>Create New Dare</h6>
            </Link>
          </div>
        </Row>
        <Row>
          <TopProfiles />
        </Row>
      </Col>
    </Row>
  );
}

export default DareCreateForm;
