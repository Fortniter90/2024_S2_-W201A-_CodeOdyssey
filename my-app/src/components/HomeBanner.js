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
            background: 'linear-gradient(#7FBBA1, #5E9C84)',
        },
        {   title: 'Java', 
            description: 'Master Python, a versatile and powerful programming language, perfect for beginners and experts alike. Dive into hands-on projects and exercises that make learning Python easy and fun.',
            background: 'linear-gradient(#F69864, #F4835F)',
        },
        {   title: 'C', 
            description: 'Master Python, a versatile and powerful programming language, perfect for beginners and experts alike. Dive into hands-on projects and exercises that make learning Python easy and fun.',
            background: 'linear-gradient(#1CBCDC, #009FCC)',
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
                {/* Circles decorations in banner */}
                <svg className='circle-svg' width="100%" height="100%" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Drop shadow filter */}
                        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
                            <feOffset dx="0" dy="0" result="offsetblur" />
                            <feFlood floodColor={`var(--${content[currentIndex].title.toLowerCase()}-dark)`} />
                            <feComposite in2="offsetblur" operator="in" />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Radial gradient */}
                        <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={`var(--${content[currentIndex].title.toLowerCase()}-light)`} />
                            <stop offset="100%" stopColor={`var(--${content[currentIndex].title.toLowerCase()}-medium)`} />
                        </radialGradient>=
                    </defs>
                    
                    {/* Circle one */}
                    <circle cx="-525%" cy="225" r="150" fill="url(#circleGradient)" filter="url(#dropShadow)" />

                    {/* Circle two */}
                    <circle cx="650%" cy="175" r="250" fill="url(#circleGradient)" filter="url(#dropShadow)" />
                </svg>

                {/* Banner content */}
                <div className='banner-content'>
                    {/* Displaying the title and description of the current banner */}
                    <h1 className='fira-code'>Learn {content[currentIndex].title}</h1>
                    <p className='roboto-regular'>{content[currentIndex].description}</p>

                    {/* Navigation dots for the banners */}
                    <div className='banner-lines'>
                        {content.map((_, index) => (
                            <span
                                key={index}
                                className={`${index === currentIndex ? 'active' : ''}`}
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