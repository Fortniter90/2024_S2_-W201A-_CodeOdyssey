import Star from "./Star";

const CodeOdysseyLogo = ({ width = '100%', darkBackground = false }) => {
    return (
        <div className='logo'>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={width}
                height='auto' 
                viewBox="0 0 843 438" 
                fill="none"
            >
                {/* Star details on the logo */}
                <g transform="translate(590, 340)">
                    <Star darkBackground={darkBackground} />
                </g>
                <g transform="translate(235, 60)">
                    <Star size={'large'} darkBackground={darkBackground} />
                </g>
                
                {/* 'O' for lower part of the logo under the circle */}
                <path 
                    xmlns="http://www.w3.org/2000/svg" 
                    d="
                        M58.76 138.696
                        C46.687 138.696 36.22 136 27.357 130.606
                        C18.624 125.084 11.881 117.25 7.128 107.105
                        C2.376 96.832 0 84.825 0 71.084
                        C0 56.83 2.505 44.373 7.514 33.714
                        C12.523 22.927 19.651 14.644 28.899 8.865
                        C38.146 2.958 48.935 0.0046 61.265 0.0046
                        C73.21 0.0046 83.613 2.766 92.475 8.288
                        C101.338 13.681 108.145 21.45 112.897 31.595
                        C117.649 41.74 120.025 53.683 120.025 67.424
                        C120.025 81.807 117.521 94.392 112.512 105.179
                        C107.503 115.837 100.374 124.12 91.127 130.028
                        C81.879 135.806 71.091 138.696 58.76 138.696
                        Z
                        M58.953 123.478
                        C72.696 123.478 83.356 118.598 90.934 108.839
                        C98.512 99.079 102.301 85.338 102.301 67.617
                        C102.301 50.665 98.769 37.695 91.705 28.706
                        C84.641 19.717 74.43 15.222 61.072 15.222
                        C47.329 15.222 36.669 20.102 29.091 29.862
                        C21.513 39.493 17.725 53.17 17.725 70.891
                        C17.725 87.971 21.257 101.005 28.321 109.994
                        C35.385 118.984 45.596 123.478 58.953 123.478
                        Z
                    " 
                    fill={darkBackground ? "var(--white)" : "var(--logo-purple)"}
                    transform="translate(72, 169)"
                />
                
                {/* Circle surrounding the logo */}
                <path 
                    d="
                        M451.39 313.213 
                        C343.331 346.227 242.283 365.001 166.33 368.737 
                        C128.314 370.608 96.8749 368.695 74.075 363.074 
                        C50.9126 357.363 38.3993 348.292 35.0486 337.325 
                        C31.6978 326.357 37.0051 311.842 53.0214 294.162 
                        C68.787 276.758 93.7892 257.601 126.359 237.907 
                        C191.432 198.558 285.719 157.655 393.778 124.641 
                        C501.838 91.627 602.886 72.853 678.839 69.1161 
                        C716.854 67.2458 748.294 69.1588 771.093 74.7799 
                        C794.256 80.4904 806.769 89.5612 810.12 100.529 
                        C813.471 111.496 808.163 126.012 792.147 143.692 
                        C776.382 161.095 751.379 180.252 718.809 199.947 
                        C653.736 239.295 559.449 280.199 451.39 313.213Z
                    " 
                    stroke={darkBackground ? "var(--logo-purple)" : "var(--white)"}
                    stroke-width="10"
                />

                {/* Text for upper part of the logo */}
                <text 
                    x="62%" 
                    y="35%" 
                    textAnchor="middle" 
                    alignmentBaseline="middle"
                    fill={darkBackground ? 'var(--white)' : 'var(--purple-accent)'}
                    style={{
                        margin: 0,
                        fontSize: '154px',
                        fontFamily: 'Ultra, serif',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        userSelect: 'none',
                    }}>
                    Code
                </text>

                {/* Text for lower part of the logo */}
                <text 
                    x="22.5%" 
                    y="59%" 
                    textAnchor="right" 
                    alignmentBaseline="middle"
                    fill={darkBackground ? 'var(--white)' : 'var(--logo-purple)'}
                    style={{
                        margin: 0,
                        fontSize: '192px',
                        fontFamily: 'Solway, regular',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        letterSpacing: '-15px',
                        userSelect: 'none',
                    }}>
                    dyssey
                </text>

                {/* Part of 'O' that overlaps the circle */}
                <path 
                    xmlns="http://www.w3.org/2000/svg" 
                    d="
                        M59 138.695
                        C71.23 138.658 81.939 135.769 91.127 130.028
                        C100.374 124.12 107.503 115.837 112.512 105.179
                        C117.521 94.392 120.025 81.807 120.025 67.424
                        C120.025 53.683 117.649 41.74 112.897 31.595
                        C108.145 21.45 101.338 13.681 92.475 8.288
                        C83.613 2.766 73.21 0.005 61.265 0.005
                        C60.504 0.005 59.749 0.016 59 0.038
                        V15.26
                        C59.683 15.235 60.374 15.222 61.072 15.222
                        C74.43 15.222 84.641 19.717 91.705 28.706
                        C98.769 37.695 102.301 50.665 102.301 67.617
                        C102.301 85.338 98.512 99.079 90.934 108.839
                        C83.365 118.587 72.72 123.467 59 123.478
                        V138.695
                        Z
                    " 
                    fill={darkBackground ? "var(--white)" : "var(--logo-purple)"}
                    transform="translate(72, 169)"
                />
            </svg>
        </div>
    );
}

export default CodeOdysseyLogo;