import { useEffect, useRef, useState } from "react";

//Custom hook that sets the expanded state of a container
const useClickOutsideToggle = () => {
  // expanded set to false initially
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      //Checks if target hit is outside the container
      if (ref.current && !ref.current.contains(e.target)) {
        // unexpand if it is outside
        setExpanded(false);
      }
    };
    //event listeners to check if there are clicks outside the container
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;
