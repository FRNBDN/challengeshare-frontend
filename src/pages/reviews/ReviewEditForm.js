import React, { useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import { Form } from "react-bootstrap";

const ReviewEditForm = (props) => {
  const { id, body, setShowEditForm, setReviews, submission, vote_pass } =
    props;

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          as="textarea"
          value={formBody}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Pass/Fail</Form.Label>
        <Form.Select
          aria-label="Pass/fail"
          name="vote_pass"
          value={formVote}
          onChange={handleVoteChange}
        >
          <option value={true}>Pass</option>
          <option value={false}>Fail</option>
        </Form.Select>
      </Form.Group>
      <div className="text-right">
        <button onClick={() => setShowEditForm(false)} type="button">
          cancel
        </button>
        <button disabled={!body.trim()} type="submit">
          save
        </button>
      </div>
    </Form>
  );
};

export default ReviewEditForm;
