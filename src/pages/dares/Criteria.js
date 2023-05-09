import React from "react";
import Card from "react-bootstrap/Card";
import Styles from "../../styles/Dare.module.css";

// Component to render criteria on dare page

const Criteria = (props) => {
  const { text } = props;
  return (
    <Card.Text className="mb-1">
      <i className={`${Styles.Smaller} fa-solid fa-circle-dot`}></i> {text}
    </Card.Text>
  );
};

export default Criteria;
