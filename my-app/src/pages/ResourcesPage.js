import NavigationBarHome from "../components/NavigationBarHome";
import NavigationBarUser from "../components/NavigationBarUser";
import './ResourcesPage.css';

import { useAuth } from "../context/AuthContext";

const ResourcesPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="resources-container">
      {isAuthenticated ? <NavigationBarUser /> : <NavigationBarHome />}

      <h1 className="resources-title">Resources Page</h1>
      <p className="resources-description">
        Welcome to the Resources Page! This section is dedicated to providing you with a curated selection of external links that offer invaluable support for your programming journey. Learning to code can be both exciting and challenging, and we believe that having access to diverse resources can make a significant difference in your experience.
      </p>
      <p className="resources-description">
        Here, you will find a variety of platforms that cater to different learning styles—whether you prefer interactive coding challenges, in-depth tutorials, video lectures, or concise reference guides. Our goal is to empower you with the tools you need to thrive in the ever-evolving world of technology.
      </p>
      <p className="resources-description">
        We encourage you to explore these resources and engage with the content in a way that resonates with you. Remember, the key to mastering programming is consistent practice, patience, and a willingness to learn from both successes and mistakes.
      </p>
      

      <h2 className="resources-subtitle">Recommended Resources</h2>
      <ul className="resources-list">
        <li>
          <a href="https://cssbattle.dev/" target="_blank" rel="noopener noreferrer">
            <u>CSS Battle</u>
          </a> - A fun and interactive platform designed to improve your CSS skills through challenges. By competing against others, you can refine your coding style and learn new techniques while enjoying the process.
        </li>
        <li>
          <a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer">
            <u>FreeCodeCamp</u>
          </a> - A nonprofit organization that offers a comprehensive curriculum for learning web development and programming. With thousands of tutorials and projects, you can gain practical experience while earning certifications that can enhance your resume.
        </li>
        <li>
          <a href="https://codewithmosh.com/" target="_blank" rel="noopener noreferrer">
            <u>Code With Mosh</u>
          </a> - Known for high-quality video courses, Mosh Hamedani provides engaging tutorials on various programming languages and frameworks. His teaching style is approachable and clear, making complex concepts easier to grasp.
        </li>
        <li>
          <a href="https://www.w3schools.com/" target="_blank" rel="noopener noreferrer">
          <u>W3Schools</u>
          </a> - A popular reference site for web developers, W3Schools offers extensive documentation on HTML, CSS, JavaScript, and more. It's an excellent resource for quick lookups and hands-on tutorials.
        </li>
      </ul>

      <h2 className="resources-subtitle">Tips for Effective Learning</h2>
      <p className="resources-tips-list"><center>
        <b>To make the most of these resources, consider the following tips:</b>
        </center>
      </p>
      <ul className="resources-tips-list">
        <li><strong>Set Goals:</strong> Establish clear, achievable goals for what you want to learn. This will help you stay focused and motivated.</li>
        <li><strong>Practice Regularly:</strong> Consistency is key in programming. Set aside time each day or week to practice coding and apply what you've learned.</li>
        <li><strong>Engage with the Community:</strong> Join forums, discussion groups, or social media communities related to programming. Engaging with others can provide support, feedback, and additional learning opportunities.</li>
        <li><strong>Work on Projects:</strong> Apply your knowledge by building personal projects or contributing to open-source projects. Real-world applications reinforce your learning and help you develop a portfolio.</li>
        <li><strong>Stay Curious:</strong> Don't hesitate to explore topics outside your current focus. Programming is a vast field, and being curious will lead you to discover new interests and skills.</li>
      </ul>

      <h2 className="resources-final-thoughts">Final Thoughts</h2>
      <p className="resources-description"><center>
        We hope this Resources Page serves as a valuable starting point in your programming journey. Remember, learning to code is a marathon, not a sprint. Embrace the challenges, celebrate your progress, and don't forget to enjoy the journey. Happy coding!
        </center>
      </p>
    </div>
  );
};

export default ResourcesPage;
