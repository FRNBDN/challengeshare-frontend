import React from "react";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, height = 30, text, nomargin }) => {
  return (
    <span>
      <img
        className={`${styles.Avatar} ${nomargin && "mx-0"}`}
        src={src}
        height={height}
        width={height}
        alt="User Avatar"
      />
    </span>
  );
};

export default Avatar;
