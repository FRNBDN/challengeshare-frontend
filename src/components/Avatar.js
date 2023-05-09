import React from "react";
import styles from "../styles/Avatar.module.css";

//Avatar component for displaying profile pictures in various sizes

const Avatar = ({ src, height = 30, nomargin }) => {
  return (
    <span className="my-2">
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
