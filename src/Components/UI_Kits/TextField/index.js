import React from "react";
import "./style.css";

const TextField = ({ title, description, placeholder }) => {
  return (
    <div className="text-parent">
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
        <textarea className="text-box " rows="6" cols="50" name="comment">
          {placeholder}
        </textarea>
      </div>
    </div>
  );
};

export default TextField;
