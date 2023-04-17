import React from "react";
import { Card } from "react-bootstrap";

const Criteria = (props) => {
  const { text } = props;
  return <Card.Text>- {text}</Card.Text>;
};

export default Criteria;
