const Star = ({ x, y, size = 1 }) => {
    const scale = size === 'small' ? 0.5 : size === 'large' ? 0.75 : 1;
    
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            style={{
                position: 'absolute',
                left: `calc(${x}vw - 32px)`, // Adjust x position based on viewport width
                top: `calc(${y}vh - 32px)`, // Adjust y position based on viewport height
            }}
        >
            <path 
                d="
                    M31.0291 0.932697C31.2794 -0.081074 32.7206 
                    -0.0810711 32.9709 0.9327L37.482 19.2062C38.3722 
                    22.8123 41.1877 25.6278 44.7938 26.518L63.0673 
                    31.0291C64.0811 31.2794 64.0811 32.7206 63.0673 
                    32.9709L44.7938 37.482C41.1877 38.3722 38.3722 
                    41.1877 37.482 44.7938L32.9709 63.0673C32.7206 
                    64.0811 31.2794 64.0811 31.0291 63.0673L26.518 
                    44.7938C25.6278 41.1877 22.8123 38.3722 19.2062 
                    37.482L0.932697 32.9709C-0.081074 32.7206 
                    -0.0810711 31.2794 0.9327 31.0291L19.2062 
                    26.518C22.8123 25.6278 25.6278 22.8123 26.518 
                    19.2062L31.0291 0.932697Z
                " 
                fill="var(--white)"
                transform={`scale(${scale})`}
                transform-origin="32 32"
            />
        </svg>
    );
};

export default Star;