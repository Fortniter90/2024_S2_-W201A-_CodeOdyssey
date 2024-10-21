import { useState } from "react";
import React from "react";
import "./Button.css";

const Button = ({
  text,
  outline = false,
  action,
  color = "var(--logo-purple)",
  backgroundColor = "var(--white)",
  hoverColor = "var(--logo-purple-dark)",
}) => {

  const [isHovered, setIsHovered] = useState(false);  // State to track if mouse is on button

  // Determine button style based on outline status and hover state
  const dynamicStyle = {
    borderColor: isHovered ? (outline ? color : hoverColor) : color,
    backgroundColor: isHovered
      ? outline
        ? color
        : hoverColor
      : outline
        ? backgroundColor
        : color,
    color: isHovered ? backgroundColor : outline ? color : backgroundColor,
  };

  return (
    <button
      className={`roboto-bold`}
      style={dynamicStyle}
      onClick={action}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </button>
  );
};

export default Button;
