import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import { Form, Button } from "react-bootstrap";
import formStyles from "../../styles/Forms.module.css";
import appStyles from "../../App.module.css";
import { Link } from "react-router-dom";
import styles from "../../styles/ReviewCreateFrom.module.css";

const ReviewEditForm = (props) => {
  const { id, body, setShowEditForm, setReviews, submission, vote_pass } =
    props;

  const [formBody, setFormBody] = useState(body);
  const [formVote, setFormVote] = useState(vote_pass);

  const handleChange = (e) => {
    setFormBody(e.target.value);
  };

  const handleVoteChange = (e) => {
    setFormVote(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosRes.put(`/reviews/${id}`, {
        body: formBody.trim(),
        submission: submission,
        vote_pass: formVote,
      });
      setReviews((prevReviews) => ({
        ...prevReviews,
        results: prevReviews.results.map((review) => {
          return review.id === id
            ? {
                ...review,
                body: formBody.trim(),
                updated_at: "now",
              }
            : review;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Form onSubmit={handleSubmit} className="py-2">
      <Form.Group className="pr-1">
        <Form.Control
          className={formStyles.Input}
          as="textarea"
          value={formBody}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className={appStyles.BrandFont}>Pass/Fail</Form.Label>
        <Form.Select
          className={formStyles.Input}
          aria-label="Pass/fail"
          name="vote_pass"
          value={formVote}
          onChange={handleVoteChange}
        >
          <option value={true}>Pass</option>
          <option value={false}>Fail</option>
        </Form.Select>
      </Form.Group>
      <div className=" py-2 ">
        {formVote === true ? (
          <Button
            className={`${appStyles.Button} ${styles.Complete} ${appStyles.BrandFont}`}
            type="submit"
          >
            Update / Completed
          </Button>
        ) : (
          <Button
            className={`${appStyles.Button} ${styles.Fail} ${appStyles.BrandFont}`}
            type="submit"
          >
            Update / Failed
          </Button>
        )}
        <span className="mx-2"> /</span>
        <Link onClick={() => setShowEditForm(false)}>Cancel</Link>
      </div>
    </Form>
  );
};

export default ReviewEditForm;
