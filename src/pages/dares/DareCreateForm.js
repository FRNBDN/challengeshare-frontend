import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { axiosReq } from "../../api/axiosDefaults";

import TopProfiles from "../profiles/TopProfiles";
import { useRedirect } from "../../hooks/useRedirect";

import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";

function DareCreateForm() {
  // redirects user to home if logged out
  useRedirect("loggedOut");
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

  // handles changes in title, description, category
  const handleChange = (e) => {
    setDareData({
      ...dareData,
      [e.target.name]: e.target.value,
    });
  };

  // handles removal of a criteria field on the form, keeps updaint index
  // on the fields
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

  //handles addition of criteria fields, give them ids, as in indexes
  // as theyre created
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

  // handles changes in criterion, takes id and text
  // to ensure that the right criteria is being changed
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
    // appends challenge information into challenge data
    challengeData.append("title", title);
    challengeData.append("description", description);
    challengeData.append("category", category);

    // makes an api request to create the challenge
    try {
      const { data } = await axiosReq.post("/challenges/", challengeData);

      // adds all the criterion to the criteria data
      const criteriaData = [];
      criteria.forEach((criterion) => {
        const formData = new FormData();
        formData.append("challenge", data.id);
        formData.append("text", criterion);
        criteriaData.push(formData);
      });

      // makes api post request for each criteira
      await Promise.all(
        criteriaData.map((formData) => axiosReq.post("/criteria/", formData))
      );

      // navigate to darepage of newly created dare
      navigate(`/dares/${data.id}`);
    } catch (error) {
      // console.log(error);
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  // text fields aka not critera
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
          <option value="Spread Positivity">Spread Positivity</option>
          <option value="Fitness">Fitness</option>
          <option value="Adventure">Adventure</option>
          <option value="Creativity">Creativity</option>
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

  // criteriafields renders programmatically based on the amount of fields in the
  // criteriafields hook up to 5
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

  // page rendering starts here
  return (
    <Row>
      <h1>
        <Link to="/dares">Dares</Link> / Create
      </h1>
      <Col md={9}>
        <TopProfiles mobile />
        {/* form start */}
        <Form onSubmit={handleSubmit}>
          <Container className={`pt-2 pb-3 ${appStyles.Box}`}>
            <Row>
              <Col>
                <Container>
                  {/* text fields here */}
                  <div>{textFields}</div>
                  <div className="d-md-none">{renderCriteriaFields}</div>
                </Container>
              </Col>
              {/* vertical on <md screens  criteriafields start here*/}
              <Col md={5} lg={4} className="d-none d-md-block">
                <div className="d-none d-md-block">{renderCriteriaFields}</div>
              </Col>
            </Row>
            <div className="m-3">
              {/* buttons starts here */}
              <Button type="submit" className={`${appStyles.Button} `}>
                Create
              </Button>
              <span className="mx-2"> /</span>
              <Link onClick={() => navigate(-1)}>Cancel</Link>
            </div>
          </Container>
        </Form>
      </Col>
      {/* sidebar starts here */}
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
