import './HomeBanner.css';
import { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const HomeBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex +1) % content.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % content.length);
    };

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + content.length) % content.length);
    };

    const handleNavClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className='banner'>
            <FaAngleLeft className='arrow-left' onClick={handlePrev} />

            <div className='banner-visuals' style={{ background: content[currentIndex].background }}>
                <div className='banner-content'>
                    <h1 className='fira-code'>Learn {content[currentIndex].title}</h1>
                    <p className='roboto-regular'>{content[currentIndex].description}</p>

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

            <FaAngleRight className='arrow-right' onClick={handleNext} />
        </div>
    );
};

export default HomeBanner;