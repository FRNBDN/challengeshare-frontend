import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import TopProfiles from "../profiles/TopProfiles";

function DareEditForm() {
  const [errors, setErrors] = useState({});
  const [criteriaFields, setCriteriaFields] = useState([{ id: 0, text: "" }]);
  const [deleteCrit, setDeleteCrit] = useState([]);

  const [dareData, setDareData] = useState({
    title: "",
    description: "",
    category: "",
    criteria: [],
  });

  const { title, description, category, criteria } = dareData;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/challenges/${id}`);
        const { title, description, category, criteria, is_owner } = data;

        const critDataReq = criteria.map((criterion) => {
          return axiosReq.get(`/criteria/${criterion}`);
        });

        const critData = await Promise.all(critDataReq);

        const updateCriteriaFields = critData.map((field, index) => {
          return {
            id: index,
            text: field.data.text,
            eid: field.data.id,
          };
        });

        if (is_owner) {
          setDareData({ title, description, category, criteria });
          setCriteriaFields(updateCriteriaFields);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [navigate, id]);

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
      if (criteriaFields[id].eid) {
        deleteCrit.push(criteriaFields[id].eid);
      }
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
    }
  };

  const handleCriterionChange = (id, text) => {
    const newCriteria = [...criteriaFields];
    newCriteria[id].text = text;
    setCriteriaFields(newCriteria);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const challengeData = new FormData();

    challengeData.append("title", title);
    challengeData.append("description", description);
    challengeData.append("category", category);

    try {
      await axiosReq.put(`/challenges/${id}`, challengeData);
      criteriaFields.forEach((criterion) => {
        const formData = new FormData();
        formData.append("challenge", id);
        formData.append("text", criterion.text);
        if (criterion.eid) {
          axiosReq.put(`/criteria/${criterion.eid}`, formData);
        } else {
          axiosReq.post(`/criteria/`, formData);
        }
      });

      await Promise.all(
        deleteCrit.map((criterion) => axiosRes.delete(`/criteria/${criterion}`))
      );

      navigate(`/dares/${id}`);
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/challenges/${id}`);
      navigate("/dares/");
    } catch (err) {
      console.log(err);
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
          <option value="Spread Positivity">Spread Positivity</option>
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
        <Form.Label>Criteria</Form.Label>
        {criteriaFields.map((field) => (
          <InputGroup key={`${field.id}`} className="mb-3">
            <Form.Control
              type="text"
              placeholder="What has to be done?"
              value={field.text}
              onChange={(e) => handleCriterionChange(field.id, e.target.value)}
            />
            <Button
              className={`${appStyles.BrandFont} ${appStyles.Button} `}
              onClick={() => handleMinusCriteria(field.id)}
            >
              -
            </Button>
          </InputGroup>
        ))}
      </Form.Group>
      {errors.field &&
        errors.field.text?.map((message, idx) => (
          <Alert variant="light" key={idx}>
            {message}
          </Alert>
        ))}
      <div className="text-center">
        <Button
          onClick={handlePlusCriteria}
          className={` ${appStyles.Button} `}
        >
          +
        </Button>
      </div>
    </div>
  );

  return (
    <Row>
      <h1 className={appStyles.BrandFont}>Dares / Edit</h1>
      <Col md={9}>
        <TopProfiles mobile />
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
            <Button
              className={`${appStyles.BrandFont} ${appStyles.Button} `}
              type="submit"
            >
              Save Changes
            </Button>
            <Button
              className={`${appStyles.BrandFont} ${appStyles.Button} `}
              onClick={() => navigate(-1)}
            >
              cancel
            </Button>
            <Button
              className={`${appStyles.BrandFont} ${appStyles.Button} `}
              variant="danger"
              onClick={handleDelete}
            >
              delete
            </Button>
          </div>
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

export default DareEditForm;
