"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMap,
  faProjectDiagram,
  faEnvelope,
  faArrowRight,
  faBrain,
  faBullseye,
  faTasks,
  faBroom,
  faChartBar,
  faSpider,
  faCalculator,
  faRobot,
  faChartLine,
  faClipboardCheck,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

export default function DataSciencePage() {
  const [scrolled, setScrolled] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize AOS animation library
    import("aos").then((AOS) => {
      AOS.init({
        duration: 800,
        offset: 100,
        once: true,
      });
    });

    // Progress bar
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercentage = (winScroll / height) * 100;
      setScrolled(scrollPercentage);

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${scrollPercentage}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <div className="progress-bar" ref={progressBarRef}></div>

      {/* Floating Navigation */}
      <div className="floating-nav">
        <a href="#intro" className="floating-nav-item" title="Introduction">
          <FontAwesomeIcon icon={faHome} />
        </a>
        <a href="#roadmap" className="floating-nav-item" title="Roadmap">
          <FontAwesomeIcon icon={faMap} />
        </a>
        <a href="#capstone" className="floating-nav-item" title="Capstone">
          <FontAwesomeIcon icon={faProjectDiagram} />
        </a>
        <a href="#contact" className="floating-nav-item" title="Contact">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden" id="intro">
        {/* Back to Home Button - Moved to top right corner */}
        <div className="absolute top-4 right-4 z-10">
          <Link
            href="/"
            className="inline-flex items-center text-gray-200 bg-indigo-700/30 px-4 py-2 rounded-full hover:bg-indigo-700/50 transition duration-300"
          >
            <span className="mr-2">Back to Home</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="transform rotate-180"
            />
          </Link>
        </div>

        <div className="gradient-bg text-gray-200 py-20">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl" data-aos="fade-up">
              <h1 className="text-5xl font-bold mb-6">
                Research and Innovation Unit (RIU)
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Advanced College of Engineering and Management
              </p>
              <div className="flex gap-4">
                <a
                  href="#roadmap"
                  className="bg-indigo-700 text-gray-200 px-6 py-3 rounded-full font-semibold hover:bg-indigo-800 transition duration-300"
                >
                  View Roadmap
                </a>

                <a
                  href="#contact"
                  className="bg-transparent border-2 border-gray-200 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 hover:border-gray-800 transition duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <FontAwesomeIcon
                icon={faBrain}
                className="text-9xl float-animation"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section
          className="glass-card dark p-8 mb-12 rounded-2xl"
          data-aos="fade-up"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-300 leading-relaxed text-lg">
              The Research and Innovation Unit (RIU) at Advanced College of
              Engineering and Management (Acem) is a dedicated platform for
              fostering academic and industry collaboration. RIU bridges the gap
              between theoretical knowledge and practical application by
              providing students opportunities to engage in research-driven,
              innovative projects.
            </p>
          </div>
        </section>

        {/* Student Engagement */}
        <section className="mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8 gradient-text">
            Student Engagement at RIU
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card dark p-8 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faBullseye} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Goals of Student Engagement
              </h3>
              <ul className="content-list">
                <li>
                  Equip students with hands-on research and technical skills
                </li>
                <li>Provide mentorship and resources for academic projects</li>
                <li>
                  Foster collaboration among students, faculty, and industry
                </li>
              </ul>
            </div>

            <div className="glass-card dark p-8 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faTasks} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Standard Engagement Procedure
              </h3>
              <div className="space-y-4">
                <div className="timeline-item dark">
                  <h4 className="font-semibold">Foundational Skills</h4>
                  <p>Complete roadmap covering essential skills</p>
                </div>
                <div className="timeline-item dark">
                  <h4 className="font-semibold">Study Groups</h4>
                  <p>Collaborative learning in RIU Hall</p>
                </div>
                <div className="timeline-item dark">
                  <h4 className="font-semibold">Deliverables</h4>
                  <p>Submit reports and complete capstone project</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8 gradient-text">
            Data Science Roadmap
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Module 1 */}
            <div className="glass-card dark p-6 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faBroom} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Data Cleaning</h3>
              <p className="text-gray-400 mb-4">
                Learn to preprocess and clean raw datasets
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="content-list">
                    <li>Handling missing values</li>
                    <li>Data type conversions</li>
                    <li>Text preprocessing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course:</h4>
                  <a
                    href="https://www.kaggle.com/learn/data-cleaning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                  >
                    Data Cleaning (Kaggle) →
                  </a>
                </div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="glass-card dark p-6 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faChartBar} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                2. EDA & Visualization
              </h3>
              <p className="text-gray-400 mb-4">
                Analyze and visualize data patterns
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="content-list">
                    <li>Descriptive statistics</li>
                    <li>Visualization techniques</li>
                    <li>Data storytelling</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Courses:</h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://www.freecodecamp.org/learn/data-analysis-with-python/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      >
                        Data Analysis with Python (freeCodeCamp) →
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.geeksforgeeks.org/python-data-visualization/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      >
                        Data Visualization with Python (GeeksforGeeks) →
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.coursera.org/learn/python-data-visualization"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      >
                        Data Visualization with Python (Coursera) →
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="glass-card dark p-6 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faSpider} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                3. Web Scraping & APIs
              </h3>
              <p className="text-gray-400 mb-4">
                Collect data programmatically
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="content-list">
                    <li>BeautifulSoup</li>
                    <li>Selenium</li>
                    <li>API Integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Courses:</h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://www.freecodecamp.org/news/web-scraping-python-tutorial/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      >
                        Web Scraping with Python (freeCodeCamp) →
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/watch?v=ng2o98k983k"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      >
                        Introduction to APIs (Corey Schafer) →
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Module 4 */}
            <div className="glass-card dark p-6 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faCalculator} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                4. Statistics & Probability
              </h3>
              <p className="text-gray-400 mb-4">
                Understand statistical concepts and probability
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="content-list">
                    <li>Descriptive statistics</li>
                    <li>Inferential statistics</li>
                    <li>Probability distributions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course:</h4>
                  <a
                    href="https://www.coursera.org/learn/stanford-statistics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                  >
                    Introduction to Statistics (Coursera) →
                  </a>
                </div>
              </div>
            </div>

            {/* Module 5 */}
            <div className="glass-card dark p-6 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faRobot} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                5. Machine Learning
              </h3>
              <p className="text-gray-400 mb-4">
                Build predictive models using machine learning
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="content-list">
                    <li>Supervised learning</li>
                    <li>Unsupervised learning</li>
                    <li>Model evaluation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Courses:</h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://www.coursera.org/learn/machine-learning"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      >
                        Machine Learning (Andrew Ng - Coursera) →
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.kaggle.com/learn/intro-to-machine-learning"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                      >
                        Intro to Machine Learning (Kaggle) →
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Module 6 */}
            <div className="glass-card dark p-6 rounded-2xl card-hover">
              <div className="text-indigo-400 mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                6. Data Visualization
              </h3>
              <p className="text-gray-400 mb-4">
                Communicate insights through data visualization
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="content-list">
                    <li>Data visualization tools</li>
                    <li>Storytelling with data</li>
                    <li>Dashboard creation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course:</h4>
                  <a
                    href="https://analytics.google.com/analytics/academy/course/10"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition duration-300"
                  >
                    Build Data Dashboards with Google Data Studio →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capstone Project */}
        <section id="capstone" className="mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8 gradient-text">
            Capstone Project
          </h2>
          <div className="glass-card dark p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-indigo-400 mb-4">
                  <FontAwesomeIcon
                    icon={faProjectDiagram}
                    className="text-3xl"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">Project Scope</h3>
                <div className="space-y-4">
                  <div className="timeline-item dark">
                    <h4 className="font-semibold">Data Collection</h4>
                    <p>Scrape or fetch data from APIs</p>
                  </div>
                  <div className="timeline-item dark">
                    <h4 className="font-semibold">Analysis</h4>
                    <p>Clean, analyze, and visualize data</p>
                  </div>
                  <div className="timeline-item dark">
                    <h4 className="font-semibold">Implementation</h4>
                    <p>Build models and create dashboards</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-indigo-400 mb-4">
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className="text-3xl"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">Deliverables</h3>
                <ul className="content-list">
                  <li>Detailed project report</li>
                  <li>GitHub repository with code</li>
                  <li>Interactive dashboard</li>
                  <li>Final presentation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Contact RIU</h2>
          <div className="glass-card dark p-8 rounded-2xl text-center">
            <div className="text-indigo-400 mb-6">
              <FontAwesomeIcon icon={faEnvelope} className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="text-gray-400 mb-6">
              For inquiries or guidance, reach out to the RIU coordinator:
            </p>
            <a
              href="mailto:riu@acem.edu.np"
              className="inline-flex items-center justify-center gap-2 bg-indigo-700 text-gray-200 px-6 py-3 rounded-full hover:bg-indigo-800 transition duration-300"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              riu@acem.edu.np
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="gradient-bg-dark text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; 2025 Research and Innovation Unit (RIU) - ACEM. All rights
            reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        :root {
          --primary: #4f46e5;
          --primary-dark: #3730a3;
          --secondary: #10b981;
        }

        .progress-bar {
          height: 0.25rem;
          background: linear-gradient(to right, #4f46e5, #10b981);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          width: ${scrolled}%;
        }

        .gradient-bg {
          background: linear-gradient(135deg, #312e81 0%, #065f46 100%);
        }

        .gradient-bg-dark {
          background: linear-gradient(135deg, #1e1b4b 0%, #064e3b 100%);
        }

        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .glass-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(71, 85, 105, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .glass-card.dark {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.3);
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(99, 102, 241, 0.4);
        }

        .timeline-item {
          position: relative;
          padding-left: 2rem;
          border-left: 2px solid var(--primary);
          margin-bottom: 2rem;
        }

        .timeline-item.dark {
          border-left: 2px solid #6366f1;
        }

        .timeline-item::before {
          content: "";
          position: absolute;
          left: -0.5rem;
          top: 0;
          width: 1rem;
          height: 1rem;
          background: var(--primary);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .timeline-item.dark::before {
          background: #6366f1;
        }

        .timeline-item:hover::before {
          background: var(--secondary);
          transform: scale(1.2);
        }

        .timeline-item.dark:hover::before {
          background: #34d399;
        }

        .content-list {
          list-style-type: none;
          padding-left: 1.5rem;
        }

        .content-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
        }

        .content-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0.5rem;
          height: 0.5rem;
          background: #6366f1;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .content-list li:hover::before {
          transform: translateY(-50%) scale(1.2);
          background: #34d399;
        }

        .floating-nav {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 9999px;
          padding: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 50;
          display: flex;
          gap: 0.5rem;
        }

        .floating-nav-item {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #6366f1;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .floating-nav-item:hover {
          background: #6366f1;
          color: #f8fafc;
        }

        .back-button {
          position: absolute;
          top: 2rem;
          right: 2rem;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(71, 85, 105, 0.3);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .back-button:hover {
          background: rgba(51, 65, 85, 0.8);
          transform: translateX(5px);
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}
