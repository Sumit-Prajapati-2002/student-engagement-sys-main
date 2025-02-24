'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function DataSciencePage() {
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressBar = document.getElementById('progressBar');
      if (progressBar) {
        progressBar.style.width = `${scrolled}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Progress Bar */}
      <div className="progress-bar fixed top-0 left-0 h-1 bg-gradient-to-r from-[#4F46E5] to-[#10B981] z-50" />

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#10B981] text-white py-20">
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-6">Research and Innovation Unit (RIU)</h1>
            <p className="text-xl opacity-90 mb-8">Advanced College of Engineering and Management</p>
            <div className="flex gap-4">
              <Link href="/" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300">
                Back to Home
              </Link>
              <Link 
                href="/"
                className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
              >
                Student Engagement System
              </Link>
            </div>
          </motion.div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <i className="fas fa-brain text-9xl animate-bounce" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <motion.section 
          className="bg-white/95 backdrop-blur-lg border border-white/20 shadow-lg p-8 mb-12 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed text-lg">
              The Research and Innovation Unit (RIU) at Advanced College of Engineering and Management
              (Acem) is a dedicated platform for fostering academic and industry collaboration. RIU bridges
              the gap between theoretical knowledge and practical application by providing students
              opportunities to engage in research-driven, innovative projects.
            </p>
          </div>
        </motion.section>

        {/* Student Engagement */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
            Student Engagement at RIU
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-bullseye text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Goals of Student Engagement</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Equip students with hands-on research and technical skills</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Provide mentorship and resources for academic projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Foster collaboration among students, faculty, and industry</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-8 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-tasks text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Standard Engagement Procedure</h3>
              <div className="space-y-6">
                <div className="relative pl-8 border-l-2 border-indigo-600">
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-indigo-600" />
                  <h4 className="font-semibold">Foundational Skills</h4>
                  <p className="text-gray-600">Complete roadmap covering essential skills</p>
                </div>
                <div className="relative pl-8 border-l-2 border-indigo-600">
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-indigo-600" />
                  <h4 className="font-semibold">Study Groups</h4>
                  <p className="text-gray-600">Collaborative learning in RIU Hall</p>
                </div>
                <div className="relative pl-8 border-l-2 border-indigo-600">
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-indigo-600" />
                  <h4 className="font-semibold">Deliverables</h4>
                  <p className="text-gray-600">Submit reports and complete capstone project</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Roadmap */}
        <motion.section 
          id="roadmap" 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
            Data Science Roadmap
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Module 1 */}
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-broom text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Data Cleaning</h3>
              <p className="text-gray-600 mb-4">Learn to preprocess and clean raw datasets</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Handling missing values</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Data type conversions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Text preprocessing</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course:</h4>
                  <a 
                    href="https://www.kaggle.com/learn/data-cleaning" 
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-800 transition duration-300"
                  >
                    Data Cleaning (Kaggle) →
                  </a>
                </div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-chart-bar text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. EDA & Visualization</h3>
              <p className="text-gray-600 mb-4">Analyze and visualize data patterns</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Descriptive statistics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Visualization techniques</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Data storytelling</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Courses:</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://www.freecodecamp.org/learn/data-analysis-with-python/" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                        Data Analysis with Python (freeCodeCamp) →
                      </a>
                    </li>
                    <li>
                      <a href="https://www.geeksforgeeks.org/python-data-visualization/" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                        Data Visualization with Python (GeeksforGeeks) →
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-spider text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Web Scraping & APIs</h3>
              <p className="text-gray-600 mb-4">Collect data programmatically</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>BeautifulSoup</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Selenium</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>API Integration</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Courses:</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://www.freecodecamp.org/news/web-scraping-python-tutorial/" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                        Web Scraping with Python (freeCodeCamp) →
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/watch?v=ng2o98k983k" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                        Introduction to APIs (Corey Schafer) →
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Module 4 */}
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-calculator text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">4. Statistics & Probability</h3>
              <p className="text-gray-600 mb-4">Understand statistical concepts and probability</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Descriptive statistics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Inferential statistics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Probability distributions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course:</h4>
                  <a href="https://www.coursera.org/learn/stanford-statistics" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                    Introduction to Statistics (Coursera) →
                  </a>
                </div>
              </div>
            </div>

            {/* Module 5 */}
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-robot text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">5. Machine Learning</h3>
              <p className="text-gray-600 mb-4">Build predictive models using machine learning</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Supervised learning</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Unsupervised learning</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Model evaluation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Courses:</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://www.coursera.org/learn/machine-learning" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                        Machine Learning (Andrew Ng - Coursera) →
                      </a>
                    </li>
                    <li>
                      <a href="https://www.kaggle.com/learn/intro-to-machine-learning" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                        Intro to Machine Learning (Kaggle) →
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Module 6 */}
            <div className="glass-card p-6 rounded-2xl card-hover">
              <div className="text-indigo-600 mb-4">
                <i className="fas fa-chart-line text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">6. Data Visualization</h3>
              <p className="text-gray-600 mb-4">Communicate insights through data visualization</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Data visualization tools</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Storytelling with data</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>Dashboard creation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course:</h4>
                  <a href="https://analytics.google.com/analytics/academy/course/10" target="_blank" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                    Build Data Dashboards with Google Data Studio →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Capstone Project */}
        <motion.section 
          id="capstone" 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
            Capstone Project
          </h2>
          <div className="bg-white/95 backdrop-blur-lg border border-white/20 shadow-lg p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-indigo-600 mb-4">
                  <i className="fas fa-project-diagram text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Project Scope</h3>
                <div className="space-y-4">
                  <div className="relative pl-8 border-l-2 border-indigo-600">
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-indigo-600" />
                    <h4 className="font-semibold">Data Collection</h4>
                    <p className="text-gray-600">Scrape or fetch data from APIs</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-indigo-600">
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-indigo-600" />
                    <h4 className="font-semibold">Analysis</h4>
                    <p className="text-gray-600">Clean, analyze, and visualize data</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-indigo-600">
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-indigo-600" />
                    <h4 className="font-semibold">Implementation</h4>
                    <p className="text-gray-600">Build models and create dashboards</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-indigo-600 mb-4">
                  <i className="fas fa-clipboard-check text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Deliverables</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>Detailed project report</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>GitHub repository with code</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>Interactive dashboard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>Final presentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section 
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
            Contact RIU
          </h2>
          <div className="bg-white/95 backdrop-blur-lg border border-white/20 shadow-lg p-8 rounded-2xl text-center">
            <div className="text-indigo-600 mb-6">
              <i className="fas fa-envelope text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="text-gray-600 mb-6">For inquiries or guidance, reach out to the RIU coordinator:</p>
            <a 
              href="mailto:riu@acem.edu.np" 
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-300"
            >
              <i className="fas fa-paper-plane" />
              riu@acem.edu.np
            </a>
          </div>
        </motion.section>
      </main>

      {/* Floating Navigation */}
      <div className="fixed bottom-8 right-8 bg-white/90 backdrop-blur-lg rounded-full p-3 shadow-lg flex gap-2 z-50">
        <a href="#intro" className="w-10 h-10 flex items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
          <i className="fas fa-home" />
        </a>
        <a href="#roadmap" className="w-10 h-10 flex items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
          <i className="fas fa-map" />
        </a>
        <a href="#capstone" className="w-10 h-10 flex items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
          <i className="fas fa-project-diagram" />
        </a>
        <a href="#contact" className="w-10 h-10 flex items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
          <i className="fas fa-envelope" />
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Research and Innovation Unit (RIU) - ACEM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 