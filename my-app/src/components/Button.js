import React from "react";


// Need outline false on hover to darken


const Button = ({ text, outline=false, action, color="var(--logo-purple)", backgroundColor="var(--white)" }) => {
    // Base styles
    const baseStyle = {
        textDecoration: "none",
        cursor: "pointer",
        borderRadius: "25px",
        padding: "5px 30px",
        fontSize: "clamp(14px, 1vw, 16px)",
        border: `3px solid ${color}`, // Transparent border for outline
        color: outline ? color : backgroundColor, // Text color based on type
        backgroundColor: outline ? "transparent" : color, // No background for outline type
        transition: "background-color 0.3s, border 0.3s, color 0.3s", // Transition for hover effects
        position: "relative", // Required for pseudo-element positioning
        overflow: "hidden", // Ensure no overflow during hover
    };

    // Hover styles
    const hoverStyle = {
        backgroundColor: outline ? color : 'var(--logo-purple-dark)', // Change background on hover
        border: `3px solid ${outline ? color : 'var(--logo-purple-dark)'}`, // Change border on hover
        color: backgroundColor, // Change color for outline button
    };

    return (
        <button
            className={`roboto-bold`}
            style={baseStyle}
            onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, baseStyle);
            }}
            onClick={action}
        >
            {text}
        </button>
    );
};

export default Button;