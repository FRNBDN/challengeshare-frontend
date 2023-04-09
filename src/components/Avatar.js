import React from "react";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, height = 30, text }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="User Avatar"
      />
    </span>
  );
};

export default Avatar;
