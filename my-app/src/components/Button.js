import "./Button.css";

const Button = ({ text, type, color, action }) => {
    return (
        <button 
            className={`button ${type} roboto-bold`} 
            style={{
                borderColor: color,
                backgroundColor: type === 'outline' ? 'transparent' : color,
                color: type === 'outline' ? color : 'var(--white)'
            }}
            onClick={action}
        >
            <p>{text}</p>
        </button>
    );
};

export default Button;