import Footer from '../components/Footer';
import NavigationBar from "../components/NavigationBar";
import "./AboutUsPage.css";

// Functional component for the About Us page
const AboutUsPage = () => {

  return (
    <div>
      {/* Renders the navigation bar at the top of the page */}
      <NavigationBar /> 

      <div className='aboutus'>
        {/* Page title */}
        <h1 className="fira-code">Welcome to Code Odyssey!</h1> 

        {/* Introductory paragraph explaining the mission of Code Odyssey */}
        <p className="roboto-medium">
          At CodeOdyssey, we believe that learning to code should be a journey filled with discovery, 
          creativity, and—most importantly—fun! We know that the world of programming can sometimes 
          feel intimidating, but our mission is to make it accessible, exciting, and downright cozy 
          for young learners. By combining interactive lessons, playful characters, and a supportive 
          learning community, we’re here to spark curiosity and build confidence in budding coders.
        </p>

        {/* Section detailing the mission of Code Odyssey */}
        <section className="aboutus-section">
          <h2 className="fira-code">Our Mission: Making Coding Cosy and Fun</h2>
          <p className="roboto-regular">
            Our mission is simple: to inspire and equip the next generation by making the fundamentals 
            of programming both enjoyable and approachable. We’ve designed CodeOdyssey to feel less like 
            a classroom and more like an adventure—one where students can explore at their own pace, 
            engage with whimsical, friendly guides, and have fun while learning real coding skills that 
            will serve them for a lifetime. Our lessons break down the complexities of programming into 
            bite-sized, manageable steps that are perfect for beginners.
          </p>
        </section>
    
        {/* Section outlining the purpose of Code Odyssey */}
        <section className="aboutus-section">
          <h2 className="fira-code">Our Purpose: Empowering the Future</h2>
          <p className="roboto-regular">
            At CodeOdyssey, we believe that learning to code opens up a world of possibilities. 
            Whether it's sparking an interest in technology, giving learners the tools to solve 
            real-world problems, or simply encouraging creative expression, programming is a skill 
            that empowers. Our purpose is to nurture that power in every learner, helping them gain 
            the confidence to tackle challenges and think critically about the digital world. We're 
            not just teaching how to code; we’re showing learners how to think like programmers, 
            creators, and innovators.
          </p>
        </section>

        {/* Section highlighting the core values of Code Odyssey */}
        <section className="aboutus-section">
          <h2 className="fira-code">Our Values: What We Stand For</h2>

          <ul>
            <li>
              <h3 className="fira-code">Curiosity First</h3>
              <p className="roboto-regular">
                Learning should be an adventure, and at CodeOdyssey, we encourage curiosity every step 
                of the way. We foster an environment where students feel safe to ask questions, make 
                mistakes, and discover the answers for themselves. Curiosity is what drives innovation, 
                and we believe it’s the heart of programming.
              </p>
            </li>

            <li>
              <h3 className="fira-code">Creativity at the Core</h3>
              <p className="roboto-regular">
                We believe coding is a tool for creation. From designing games to building apps, coding 
                is the new canvas for young creators. That’s why we celebrate creativity in everything 
                we do. Our courses are designed to let learners play with ideas, think outside the box, 
                and bring their imaginations to life using the power of code.
              </p>
            </li>

            <li>
              <h3 className="fira-code">A Supportive Community</h3>
              <p className="roboto-regular">
                At CodeOdyssey, no one goes on their journey alone. We’ve built a cozy, welcoming 
                community where learners can connect with one another and support each other. Whether 
                celebrating a big achievement or helping out with a tricky challenge, we foster a sense 
                of belonging and teamwork.
              </p>
            </li>

            <li>
              <h3 className="fira-code">Learning with Kindness</h3>
              <p className="roboto-regular">
                We believe that learning happens best in a kind, supportive environment. Whether it’s 
                from our characters, our instructors, or the community, kindness and encouragement are 
                at the core of our teaching approach. We’re here to build confidence, celebrate progress, 
                and ensure every learner feels supported on their journey.
              </p>
            </li>
          </ul>
        </section>

        {/* Section describing the learning approach of Code Odyssey */}
        <section className="aboutus-section">
          <h2 className="fira-code">Our Approach: Adventure Meets Learning</h2>
          <p className="roboto-regular">
            CodeOdyssey is more than just a place to learn how to code—it’s a full-fledged adventure. Our 
            adorable characters, like Javabara the Capybara and Bon Bon the Bunny, guide learners 
            through every twist and turn.
          </p>
        </section>

        {/* Section inviting users to join Code Odyssey */}
        <section className="aboutus-section">
          <h2 className="fira-code">Join Us on the CodeOdyssey!</h2>
          <p className="roboto-regular">
            Let’s learn, create, and discover the endless possibilities together—join us on the 
            CodeOdyssey today!
          </p>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

// Exporting the AboutUsPage component for use in other parts of the application
export default AboutUsPage;