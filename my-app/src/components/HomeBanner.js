import './HomeBanner.css';
import { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// Image Imports
import SnakeNeutral from './assets/SnakeS2-Neutral.png';
import CapybaraSad from './assets/CapybaraS2-Sad.png';
import BunnyConcerned from './assets/BunnyS2-Concerned.png';



// HomeBanner to display courses to make users know what we have
const HomeBanner = () => {

    const [currentIndex, setCurrentIndex] = useState(0); // Track the current banner index

    // Array of the content for the banner
    const content = [
        {
            title: 'Python',
            description: 'Unlock the power of Python, a beginner-friendly yet versatile language used in everything from web development to AI. Whether you\'re automating tasks or diving into data science, Python\'s simplicity and wide-ranging applications make it the perfect first step into programming.',
            background: 'linear-gradient(#7FBBA1, #5E9C84)',
            image: SnakeNeutral,
        },
        {
            title: 'Java',
            description: 'Learn Java to master one of the most in-demand languages powering enterprise systems, Android apps, and large-scale web applications. Its stability, scalability, and portability make Java an essential tool for building high-performance, cross-platform solutions.',
            background: 'linear-gradient(#F69864, #F4835F)',
            image: CapybaraSad, 
        },
        {
            title: 'C',
            description: 'Get to the core of programming with C, a language that forms the backbone of modern computing. Learning C gives you a deep understanding of how software works at the hardware level, making it ideal for system programming, embedded systems, and performance-critical applications.',
            background: 'linear-gradient(#1CBCDC, #009FCC)',
            image: BunnyConcerned,
        },
    ];
    


    // Automatically change the banner every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex +1) % content.length);  // Cycle through banners
        }, 5000);

        return () => clearInterval(interval); // Clear the interval when component unmounts
    }, [currentIndex]); 

    // Function to go to the next banner
    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % content.length);   // Increment index and loop back when reaching the end
    };

    // Function to go to the previous banner
    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + content.length) % content.length);  // Decrement index and loop back when reaching the end
    };

    // Function to handle navigation clicks on the dots
    const handleNavClick = (index) => {
        setCurrentIndex(index);
    };



    return (
        <div className='banner'>
            {/* Left arrow for the previous banner */}
            <FaAngleLeft className='arrow-left' onClick={handlePrev} />

            {/* Display the image for the current banner */}
            <img 
                src={content[currentIndex].image} 
                alt={`${content[currentIndex].title} banner`} 
                className='banner-image' 
            />

            {/* Banner visuals container */}
            <div className='banner-visuals' style={{ background: content[currentIndex].background }}>
                
                {/* Decorative circles in banner */}
                <svg className='circle-svg' width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"  xmlns="http://www.w3.org/2000/svg">
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
                    <circle cx="8%" cy="61.5%" r="14%" fill="url(#circleGradient)" filter="url(#dropShadow)" />

                    {/* Circle two */}
                    <circle cx="90%" cy="54%" r="20%" fill="url(#circleGradient)" filter="url(#dropShadow)" />
                </svg>

                {/* Banner content */}
                <div className='banner-content'>
                    <div className='banner-text'>
                        <h1 className='fira-code'>Learn {content[currentIndex].title}</h1>
                        <p className='roboto-regular'>{content[currentIndex].description}</p>
                    </div>

                    {/* Lines for navigating between banners */}
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