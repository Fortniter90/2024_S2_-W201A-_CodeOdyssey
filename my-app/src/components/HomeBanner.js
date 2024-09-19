import './HomeBanner.css';
import { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// HomeBanner to display courses to make users know what we have
const HomeBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0); // State to track the current banner index

    // Array of the content for the banner
    const content = [
        {   title: 'Python', 
            description: 'Master Python, a versatile and powerful programming language, perfect for beginners and experts alike. Dive into hands-on projects and exercises that make learning Python easy and fun.',
            background: 'linear-gradient(var(--python-light), var(--python-medium), var(--python-dark))',
        },
        {   title: 'Java', 
            description: 'Master Python, a versatile and powerful programming language, perfect for beginners and experts alike. Dive into hands-on projects and exercises that make learning Python easy and fun.',
            background: 'linear-gradient(var(--java-light), var(--java-medium), var(--java-dark))',
        },
        {   title: 'C', 
            description: 'Master Python, a versatile and powerful programming language, perfect for beginners and experts alike. Dive into hands-on projects and exercises that make learning Python easy and fun.',
            background: 'linear-gradient(var(--c-light), var(--c-medium), var(--c-dark))',
        },
    ];

    // Automatically change the banner every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex +1) % content.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Function to go to the next banner
    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % content.length);
    };

    // Function to go to the previous banner
    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + content.length) % content.length);
    };

    // Function to handle navigation clicks on the dots
    const handleNavClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className='banner'>
            {/* Left arrow for the previous banner */}
            <FaAngleLeft className='arrow-left' onClick={handlePrev} />

            {/* Banner visuals container */}
            <div className='banner-visuals' style={{ background: content[currentIndex].background }}>
                <div className='banner-content'>
                    {/* Displaying the title and description of the current banner */}
                    <h1 className='fira-code'>Learn {content[currentIndex].title}</h1>
                    <p className='roboto-regular'>{content[currentIndex].description}</p>

                    {/* Navigation dots for the banners */}
                    <div className='banner-lines'>
                        {content.map((_, index) => (
                            <span
                                key={index}
                                className={`line ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => handleNavClick(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right arrow for the next banner */}
            <FaAngleRight className='arrow-right' onClick={handleNext} />
        </div>
    );
};

export default HomeBanner;