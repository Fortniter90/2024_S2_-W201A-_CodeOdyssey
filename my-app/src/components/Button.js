import "./Button.css";

const Button = ({ text, type, action }) => {
    return (
        <button className={`button ${type} roboto-bold`} onClick={action}>
            {text}
        </button>
    );
};

export default Button;