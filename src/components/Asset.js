import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

// Asset with a custom light variant prop

const Asset = ({ spinner, src, message, light }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && (
        <Spinner animation="border" variant={light ? "light" : "dark"} />
      )}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;
