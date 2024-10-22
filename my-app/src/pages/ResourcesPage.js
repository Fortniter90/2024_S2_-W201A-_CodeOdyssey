import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import './ResourcesPage.css';

const ResourcesPage = () => {

  return (
    <div>
      {/* Conditionally rendering the navigation bar based on the user's authentication status */}
      <NavigationBar />
      
      <div className="resources">
        {/* Main title of the Resources Page */}
        <h1 className="fira-code">Resources Page</h1>

        {/* Description paragraph introducing the purpose of the Resources Page */}
        <p className="resources-description roboto-regular">
          Welcome to the Resources Page! This section is dedicated to providing you with a curated selection of external links that offer invaluable support for your programming journey. Learning to code can be both exciting and challenging, and we believe that having access to diverse resources can make a significant difference in your experience.
        </p>

        {/* Additional information on the resources available for different learning styles */}
        <p className="resources-description roboto-regular">
          Here, you will find a variety of platforms that cater to different learning styles—whether you prefer interactive coding challenges, in-depth tutorials, video lectures, or concise reference guides. Our goal is to empower you with the tools you need to thrive in the ever-evolving world of technology.
        </p>
        
        {/* Encouragement for users to engage with the resources and advice on effective learning */}
        <p className="resources-description roboto-regular">
          We encourage you to explore these resources and engage with the content in a way that resonates with you. Remember, the key to mastering programming is consistent practice, patience, and a willingness to learn from both successes and mistakes.
        </p>
        
        {/* Subtitle for the recommended resources section */}
        <h2 className="fira-code">Recommended Resources</h2>
        <hr />
        {/* List of external resource links with descriptions */}
        <ul className="roboto-regular">
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

        {/* Subtitle for the effective learning tips section */}
        <h2 className="fira-code">Tips for Effective Learning</h2>
        <hr />

        {/* Introduction to the learning tips section */}
        <p className="roboto-medium">
          <center>
            <b>To make the most of these resources, consider the following tips:</b>
          </center>
        </p>
        {/* List of tips for effective learning */}
        <ul className="roboto-regular">
          <li><strong>Set Goals:</strong> Establish clear, achievable goals for what you want to learn. This will help you stay focused and motivated.</li>
          <li><strong>Practice Regularly:</strong> Consistency is key in programming. Set aside time each day or week to practice coding and apply what you've learned.</li>
          <li><strong>Engage with the Community:</strong> Join forums, discussion groups, or social media communities related to programming. Engaging with others can provide support, feedback, and additional learning opportunities.</li>
          <li><strong>Work on Projects:</strong> Apply your knowledge by building personal projects or contributing to open-source projects. Real-world applications reinforce your learning and help you develop a portfolio.</li>
          <li><strong>Stay Curious:</strong> Don't hesitate to explore topics outside your current focus. Programming is a vast field, and being curious will lead you to discover new interests and skills.</li>
        </ul>
      </div>

      <Footer />
    </div>
  );
};
  
export default ResourcesPage;