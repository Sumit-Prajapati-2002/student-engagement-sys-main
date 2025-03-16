from flask import Flask, render_template, request, jsonify, url_for, session, redirect
from werkzeug.utils import secure_filename
import groq
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import os
import json
import tempfile
from datetime import datetime
import random
from dotenv import load_dotenv
from flask_cors import CORS

# Load enviroxnment variables
load_dotenv()

app = Flask(__name__, 
           template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates'))
app.secret_key = os.getenv('SECRET_KEY', os.urandom(24).hex())
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    },
    r"/chatbot": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    },
    r"/search_jobs": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure maximum file size (e.g., 16MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Initialize Groq Client
api_key = "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"  # This is your valid API key
client = groq.Groq(api_key=api_key)

# Dictionary mapping resources to their official websites
RESOURCE_WEBSITES = {
    # Learning Platforms
    'Codecademy': 'https://www.codecademy.com',
    'Coursera': 'https://www.coursera.org',
    'edX': 'https://www.edx.org',
    'Udemy': 'https://www.udemy.com',
    'freeCodeCamp': 'https://www.freecodecamp.org',
    'Khan Academy': 'https://www.khanacademy.org',
    'Pluralsight': 'https://www.pluralsight.com',
    'DataCamp': 'https://www.datacamp.com',
    'LeetCode': 'https://leetcode.com',
    'HackerRank': 'https://www.hackerrank.com',
    'GitHub': 'https://github.com',
    'Stack Overflow': 'https://stackoverflow.com',
    'W3Schools': 'https://www.w3schools.com',
    'MDN Web Docs': 'https://developer.mozilla.org',
    'Real Python': 'https://realpython.com',
    'GeeksforGeeks': 'https://www.geeksforgeeks.org',
    'TutorialsPoint': 'https://www.tutorialspoint.com',
    
    # Common Books (linking to their official pages or publisher sites)
    'Python Crash Course': 'https://nostarch.com/pythoncrashcourse2e',
    'Learning Python': 'https://www.oreilly.com/library/view/learning-python-5th/9781449355722/',
    'Head First Python': 'https://www.oreilly.com/library/view/head-first-python/9781491919521/',
    'Automate the Boring Stuff with Python': 'https://automatetheboringstuff.com',
    'Django for Beginners': 'https://djangoforbeginners.com',
    'Flask Web Development': 'https://www.oreilly.com/library/view/flask-web-development/9781491991725/',
    'JavaScript: The Good Parts': 'https://www.oreilly.com/library/view/javascript-the-good/9780596517748/',
    'Clean Code': 'https://www.pearson.com/store/p/clean-code-a-handbook-of-agile-software-craftsmanship/P100000701846',
    'Design Patterns': 'https://www.pearson.com/store/p/design-patterns-elements-of-reusable-object-oriented-software/P100000701823'
}

def analyze_state(field, answers):
    state = {
        'level': 'Entry Level',
        'focus': '',
        'learning_path': ''
    }

    if field == 'computer':
        # Programming proficiency
        if answers[0] in ["Python", "Java", "C++"]:
            state['focus'] = f"{answers[0]} Development"
        else:
            state['focus'] = "Software Development"

        # Hardware experience
        if answers[1] == "Expert":
            state['level'] = "Senior Level"
        elif answers[1] == "Advanced":
            state['level'] = "Mid Level"
        
        # Learning path based on interest and style
        state['learning_path'] = f"{answers[2]} with {answers[4]}"

    elif field == 'electrical':
        # Circuit design experience
        if answers[0] == "Expert":
            state['level'] = "Senior Level"
        elif answers[0] == "Advanced":
            state['level'] = "Mid Level"

        # Focus area based on tools and experience
        if answers[3] == "Multiple Tools":
            state['focus'] = "Advanced Electronics"
        else:
            state['focus'] = f"{answers[3]} Specialist"

        # Learning path based on project experience
        state['learning_path'] = f"{answers[4]} Track"

    elif field == 'civil':
        # Software proficiency
        if answers[0] == "Multiple Tools":
            state['focus'] = "Advanced Design"
        else:
            state['focus'] = f"{answers[0]} Design"

        # Experience level
        if answers[1] == "3+ Years":
            state['level'] = "Senior Level"
        elif answers[1] == "1-3 Years":
            state['level'] = "Mid Level"

        # Learning path based on specialization
        state['learning_path'] = f"{answers[4]} Engineering"

    elif field == 'programmer':
        # Programming language proficiency
        state['focus'] = f"{answers[0]} Development"

        # Experience level
        if answers[4] == "Senior":
            state['level'] = "Senior Level"
        elif answers[4] == "Advanced":
            state['level'] = "Mid Level"

        # Learning path based on application type
        state['learning_path'] = f"{answers[2]} Development"

    elif field == 'data_science':
        # Data science skills
        state['focus'] = "Data Science"

        # Experience level
        if answers[4] == "Senior":
            state['level'] = "Senior Level"
        elif answers[4] == "Advanced":
            state['level'] = "Mid Level"

        # Learning path based on data science skills
        state['learning_path'] = f"{answers[2]} with {answers[4]}"

    return state

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            # Limit the text to approximately 2000 tokens (about 8000 characters)
            return text[:8000]
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def field_prompts(field):
    prompts = {
        'computer': """Based on the resume and responses below, create a detailed 12-week roadmap for a Computer Engineering career path.

Resume Content:
{resume_text}

Their responses:
1. Programming Languages: {q1}
2. Hardware Experience: {q2}
3. Area of Interest: {q3}
4. Architecture Knowledge: {q4}
5. Learning Style: {q5}

Format the roadmap as follows:
[OVERVIEW]
Brief overview of the learning path and goals.

[SKILLS TO MASTER]
• List key skills to be mastered
• Include both technical and soft skills

[WEEKLY BREAKDOWN]
Week 1: [Focus Area]
📚 Learning Goals:
• Goal 1
• Goal 2

🛠️ Practical Tasks:
• Task 1
• Task 2

📖 Resources:
• Resource 1
• Resource 2

[Continue this format for all 12 weeks]""",

        'electrical': """Based on the resume and responses below, create a detailed 12-week roadmap for an Electrical Engineering career path.

Resume Content:
{resume_text}

Their responses:
1. Circuit Design: {q1}
2. Power Systems: {q2}
3. Control Systems: {q3}
4. Software Tools: {q4}
5. Project Experience: {q5}

Format the roadmap as follows:
[OVERVIEW]
Brief overview of the learning path and goals.

[SKILLS TO MASTER]
• List key skills to be mastered
• Include both technical and soft skills

[WEEKLY BREAKDOWN]
Week 1: [Focus Area]
📚 Learning Goals:
• Goal 1
• Goal 2

🛠️ Practical Tasks:
• Task 1
• Task 2

📖 Resources:
• Resource 1
• Resource 2

[Continue this format for all 12 weeks]""",

        'civil': """Based on the resume and responses below, create a detailed 12-week roadmap for a Civil Engineering career path.

Resume Content:
{resume_text}

Their responses:
1. Design Software: {q1}
2. Construction Experience: {q2}
3. Structural Analysis: {q3}
4. Project Management: {q4}
5. Specialization: {q5}

Format the roadmap as follows:
[OVERVIEW]
Brief overview of the learning path and goals.

[SKILLS TO MASTER]
• List key skills to be mastered
• Include both technical and soft skills

[WEEKLY BREAKDOWN]
Week 1: [Focus Area]
📚 Learning Goals:
• Goal 1
• Goal 2

🛠️ Practical Tasks:
• Task 1
• Task 2

📖 Resources:
• Resource 1
• Resource 2

[Continue this format for all 12 weeks]""",

        'programmer': """Based on the resume and responses below, create a detailed 12-week roadmap for a Software Development career path.

Resume Content:
{resume_text}

Their responses:
1. Primary Language: {q1}
2. Framework Experience: {q2}
3. Application Types: {q3}
4. Version Control: {q4}
5. Experience Level: {q5}

Format the roadmap as follows:
[OVERVIEW]
Brief overview of the learning path and goals.

[SKILLS TO MASTER]
• List key skills to be mastered
• Include both technical and soft skills

[WEEKLY BREAKDOWN]
Week 1: [Focus Area]
📚 Learning Goals:
• Goal 1
• Goal 2

🛠️ Practical Tasks:
• Task 1
• Task 2

📖 Resources:
• Resource 1
• Resource 2

[Continue this format for all 12 weeks]""",

        'data_science': """Based on the resume and responses below, create a detailed 12-week roadmap for a Data Science career path.

Resume Content:
{resume_text}

Their responses:
1. Data Science Skills: {q1}
2. Data Analysis Experience: {q2}
3. Machine Learning Knowledge: {q3}
4. Data Visualization Tools: {q4}
5. Project Experience: {q5}

Format the roadmap as follows:
[OVERVIEW]
Brief overview of the learning path and goals.

[SKILLS TO MASTER]
• List key skills to be mastered
• Include both technical and soft skills

[WEEKLY BREAKDOWN]
Week 1: [Focus Area]
📚 Learning Goals:
• Goal 1
• Goal 2

🛠️ Practical Tasks:
• Task 1
• Task 2

📖 Resources:
• Resource 1
• Resource 2

[Continue this format for all 12 weeks]"""
    }
    return prompts.get(field)

def get_field_questions(field):
    questions = {
        'programmer': [
            {
                'question': 'What is your primary programming language?',
                'options': ['Python', 'Java', 'JavaScript', 'C++', 'Other']
            },
            {
                'question': 'What type of development interests you?',
                'options': ['Web', 'Mobile', 'Desktop', 'Game', 'AI/ML']
            },
            {
                'question': 'What kind of applications do you want to build?',
                'options': ['Enterprise', 'Consumer', 'Scientific', 'Creative']
            },
            {
                'question': 'How do you prefer to work?',
                'options': ['Solo', 'Small Team', 'Large Team', 'Open Source']
            },
            {
                'question': 'What is your current level?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Senior']
            }
        ],
        'data_science': [
            {
                'question': 'What data science skills do you have?',
                'options': ['Data Analysis', 'Machine Learning', 'Data Visualization', 'Statistics', 'Other']
            },
            {
                'question': 'What type of data analysis experience do you have?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            {
                'question': 'What machine learning knowledge do you have?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            {
                'question': 'What data visualization tools are you familiar with?',
                'options': ['Tableau', 'Power BI', 'D3.js', 'Matplotlib', 'Other']
            },
            {
                'question': 'What project experience do you have?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            }
        ]
    }
    
    return questions.get(field, [])

# RIU Document for Data Science
DATA_SCIENCE_DOCUMENT = """Research and Innovation Unit (RIU) Engagement Document

The Research and Innovation Unit (RIU) at Advanced College of Engineering and Management
(Acem) is a dedicated platform for fostering academic and industry collaboration. RIU bridges
the gap between theoretical knowledge and practical application by providing students
opportunities to engage in research-driven, innovative projects. Our mission is to create a
culture of innovation that equips students with essential skills, prepares them for industry
challenges, and contributes to national and global advancements.

Student Engagement at RIU
1. Goals of Student Engagement
● Equip students with hands-on research and technical skills.
● Provide mentorship and resources for academic and industry-driven projects.
● Foster collaboration among students, faculty, and industry professionals.

2. Standard Engagement Procedure
Students interested in joining RIU must follow these steps:
1. Foundational Skills Requirement:
○ Students must complete a roadmap covering essential skills in their chosen track.
2. Study Group Participation:
○ Students are encouraged to use the RIU Hall as a collaborative space for study
groups.
○ Study groups should focus on sharing knowledge, solving problems
collaboratively, and completing the required learning milestones.

3. Preliminary Deliverables:
○ Before joining RIU projects, students must:
■ Complete the roadmap.
■ Submit a comprehensive report or presentation summarizing their
learning.
■ Successfully deliver a capstone project related to their track.

4. Assessment and Feedback:
○ Students' submissions will be reviewed by RIU faculty or mentors for approval.
○ Constructive feedback will be provided to ensure readiness for advanced
projects.

Roadmap for Data Science Track

Students interested in Data Science must complete the following comprehensive roadmap,
covering all essential steps from data cleaning to machine learning. All courses listed are freely
available online.

1. Data Cleaning and Preparation
Objective: Learn to preprocess and clean raw datasets for analysis.
Skills to Learn:
● Handling missing values, duplicates, and outliers.
● Data type conversions and formatting.
● Basic text preprocessing.
Recommended Free Courses:
● Data Cleaning (Kaggle)

2. Exploratory Data Analysis (EDA) and Visualization
Objective: Analyze datasets to uncover trends and visualize findings.
Skills to Learn:
● Descriptive statistics (mean, median, variance).
● Visualization techniques (scatter plots, bar charts, heatmaps).
● Data storytelling through graphs.
Recommended Free Courses:
● Data Analysis with Python (freeCodeCamp)
● Data Visualization with Python (Geeks4Geeks)
● Data Visualization with Python (Coursera-Audit Free)

3. Web Scraping and APIs
Objective: Collect data programmatically from websites and APIs.
Skills to Learn:
● Static web scraping with BeautifulSoup.
● Handling dynamic pages using Selenium.
● Using APIs to fetch structured data.
Recommended Free Courses:
● Web Scraping with Python (YouTube - freeCodeCamp).
● Introduction to APIs (YouTube - Corey Schafer).

4. Statistical Analysis
Objective: Apply statistical methods to derive insights from data.
Skills to Learn:
● Descriptive statistics (mean, median, standard deviation).
● Hypothesis testing and confidence intervals.
● Correlation and regression basics.
Recommended Free Courses:
● Introduction to Statistics (Coursera- Audit Free)

5. Machine Learning Basics
Objective: Build predictive models and evaluate their performance.
Skills to Learn:
● Supervised learning: Linear regression, decision trees.
● Unsupervised learning: Clustering, PCA.
● Model evaluation (accuracy, precision, recall).
Recommended Free Courses:
● Machine Learning (Andrew Ng - Coursera) (Audit Free).
● Intro to Machine Learning (Kaggle)

6. Dashboard Development
Objective: Present insights interactively for stakeholders.
Skills to Learn:
● Designing dashboards with tools like Google Data Studio or Tableau.
● Communicating data-driven insights visually.
Recommended Free Courses:
● Build Data Dashboards with Google Data Studio (Google).

In addition, students should know how to use Git and Github (Version control for managing and
sharing your projects.)
Introduction to git and github (freeCodeCamp)

Capstone Project
Objective: Apply all learned skills in an end-to-end project.
Project Scope:
1. Data Collection:
○ Scrape or fetch a dataset from a website or API.
2. Data Cleaning:
○ Handle null values, duplicates, and reformat the data.
3. Exploratory Analysis:
○ Generate visualizations and write insights from trends.
4. Model Development:
○ Train a machine learning model for prediction or classification. (Optional)
5. Dashboard:
○ Present findings in an interactive dashboard.

Deliverables:
● A detailed project report.
● A GitHub repository containing the code and data.
● A presentation explaining the project.

Utilizing RIU Hall
1. Study Groups
● Students are encouraged to form study groups to collaboratively complete the roadmap
requirements.
● The RIU Hall provides:
○ Access to resources such as whiteboards, and internet connectivity.
○ A quiet, focused environment conducive to learning and teamwork.

2. Usage Guidelines
● Groups must ensure the space is used for productive study and skill development.
● RIU mentors may periodically observe and guide group activities.

Getting Involved in RIU Projects
After completing the roadmap and capstone project, students who demonstrate exceptional
performance and motivation will be eligible to:
1. Join ongoing research and innovation projects at RIU.
2. Collaborate with industry partners under RIU mentorship.
3. Contribute to national-level initiatives aimed at bridging the industry-academia gap.

Contact RIU
For inquiries or guidance, students can reach out to the RIU coordinator at:
Email: riu@acem.edu.np"""

# Load and preprocess job data
def load_job_data():
    df = pd.read_csv('datajobposts.csv')
    # Combine relevant columns for text similarity
    df['combined_text'] = df['Title'].fillna('') + ' ' + df['jobpost'].fillna('')
    return df

# Calculate job recommendations using cosine similarity
def get_job_recommendations(search_query, num_recommendations=5):
    df = load_job_data()
    
    # Create TF-IDF vectorizer
    tfidf = TfidfVectorizer(stop_words='english')
    
    # Create TF-IDF matrix
    tfidf_matrix = tfidf.fit_transform(df['combined_text'])
    
    # Transform search query
    query_vector = tfidf.transform([search_query])
    
    # Calculate cosine similarity
    cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    
    # Get top recommendations
    related_docs_indices = cosine_similarities.argsort()[-num_recommendations:][::-1]
    
    # Get recommended jobs
    recommendations = []
    for idx in related_docs_indices:
        recommendations.append({
            'title': df['Title'].iloc[idx],
            'company': df['Company'].iloc[idx],
            'description': df['jobpost'].iloc[idx],
            'similarity_score': float(cosine_similarities[idx])
        })
    
    return recommendations

def generate_company_email(company_name):
    # Clean company name for email
    clean_name = ''.join(e.lower() for e in company_name if e.isalnum())[:10]  # limit length
    domains = ['careers', 'jobs', 'hr', 'hiring', 'recruitment']
    domain = random.choice(domains)
    tlds = ['com.np', 'org.np', 'edu.np']
    tld = random.choice(tlds)
    return f"{domain}@{clean_name}.{tld}"

@app.route('/', methods=['GET', 'POST'])
def index():
    questions = {
        'computer': [
            {
                'question': 'What programming languages are you most proficient in?',
                'options': ['Python', 'Java', 'C++', 'JavaScript', 'Other']
            },
            {
                'question': 'How would you rate your hardware knowledge?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            {
                'question': 'What area of computer engineering interests you most?',
                'options': ['Software Development', 'Hardware Design', 'Networking', 'AI/ML', 'Cybersecurity']
            },
            {
                'question': 'What is your preferred learning style?',
                'options': ['Self-paced', 'Structured', 'Project-based', 'Mentorship']
            },
            {
                'question': 'What type of projects have you worked on?',
                'options': ['Web Applications', 'Mobile Apps', 'Desktop Software', 'Embedded Systems', 'None yet']
            }
        ],
        'electrical': [
            {
                'question': 'How experienced are you with circuit design?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            {
                'question': 'Which area interests you most?',
                'options': ['Power Systems', 'Electronics', 'Control Systems', 'Communications']
            },
            {
                'question': 'Have you worked with microcontrollers?',
                'options': ['Yes, extensively', 'Some experience', 'Very little', 'No experience']
            },
            {
                'question': 'What design tools are you familiar with?',
                'options': ['AutoCAD', 'MATLAB', 'PSpice', 'Multiple Tools']
            },
            {
                'question': 'What type of projects interest you?',
                'options': ['Industrial', 'Consumer Electronics', 'Renewable Energy', 'Robotics']
            }
        ],
        'civil': [
            {
                'question': 'Which design software are you proficient in?',
                'options': ['AutoCAD', 'Revit', 'SketchUp', 'Multiple Tools']
            },
            {
                'question': 'How much practical experience do you have?',
                'options': ['< 1 Year', '1-3 Years', '3+ Years', 'No experience']
            },
            {
                'question': 'Which area interests you most?',
                'options': ['Structural', 'Transportation', 'Environmental', 'Construction Management']
            },
            {
                'question': 'Have you worked on any construction projects?',
                'options': ['Yes, multiple', 'One project', 'As an intern', 'No experience']
            },
            {
                'question': 'What type of engineering interests you?',
                'options': ['Building Design', 'Infrastructure', 'Environmental', 'Urban Planning']
            }
        ],
        'programmer': [
            {
                'question': 'What is your primary programming language?',
                'options': ['Python', 'Java', 'JavaScript', 'C++', 'Other']
            },
            {
                'question': 'What type of development interests you?',
                'options': ['Web', 'Mobile', 'Desktop', 'Game', 'AI/ML']
            },
            {
                'question': 'What kind of applications do you want to build?',
                'options': ['Enterprise', 'Consumer', 'Scientific', 'Creative']
            },
            {
                'question': 'How do you prefer to work?',
                'options': ['Solo', 'Small Team', 'Large Team', 'Open Source']
            },
            {
                'question': 'What is your current level?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Senior']
            }
        ],
        'data_science': [
            {
                'question': 'What data science skills do you have?',
                'options': ['Data Analysis', 'Machine Learning', 'Data Visualization', 'Statistics', 'Other']
            },
            {
                'question': 'What type of data analysis experience do you have?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            {
                'question': 'What machine learning knowledge do you have?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            {
                'question': 'What data visualization tools are you familiar with?',
                'options': ['Tableau', 'Power BI', 'D3.js', 'Matplotlib', 'Other']
            },
            {
                'question': 'What project experience do you have?',
                'options': ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            }
        ]
    }
    
    if request.method == 'GET':
        return render_template("index.html", roadmap=None, questions=questions)

    if request.method == "POST":
        try:
            # Debug print
            print("Form data received:", request.form)
            print("Files received:", request.files)

            # Check for file
            if 'file' not in request.files:
                return render_template("index.html", error="Please upload your resume", questions=questions)

            file = request.files['file']
            if not file or file.filename == '':
                return render_template("index.html", error="No file selected", questions=questions)

            # Check file extension
            allowed_extensions = {'pdf'}
            if not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
                return render_template("index.html", error="Only PDF files are allowed", questions=questions)

            try:
                # Save the uploaded file
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                print(f"File saved to: {file_path}")

                # Extract text from PDF
                text = extract_text_from_pdf(file_path)
                if not text:
                    os.remove(file_path)  # Clean up the file if text extraction fails
                    return render_template("index.html", error="Could not extract text from PDF", questions=questions)

                print("PDF text extracted successfully")

                # Get and validate form data
                selected_field = request.form.get('selectedField')
                answers_json = request.form.get('answers')
                
                print("Selected field:", selected_field)
                print("Answers JSON:", answers_json)

                if not selected_field:
                    print("No field selected")
                    return render_template("index.html", error="Please select a field", questions=questions)

                if not answers_json:
                    print("No answers provided")
                    return render_template("index.html", error="Please answer all questions", questions=questions)

                try:
                    answers = json.loads(answers_json)
                except json.JSONDecodeError as e:
                    print("Error decoding answers:", e)
                    return render_template("index.html", error="Invalid answers format", questions=questions)

                if not answers or len(answers) < 5:
                    print("Incomplete answers")
                    return render_template("index.html", error="Please answer all questions", questions=questions)

                # Analyze state based on answers
                state = analyze_state(selected_field, answers)
                print("State analyzed:", state)

                # Get prompt template
                prompt = field_prompts(selected_field)
                if not prompt:
                    print("Invalid field selected")
                    return render_template("index.html", error="Invalid field selected", questions=questions)

                # Create the complete prompt
                complete_prompt = f"""
                Resume Text:
                {text}

                Field: {selected_field}
                Answers: {answers}
                Current State: {state}

                {prompt}
                """

                # Generate roadmap using Groq
                chat_completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": complete_prompt
                        }
                    ],
                    model="mixtral-8x7b-32768",
                    temperature=0.7,
                    max_tokens=4096,
                    top_p=1,
                    stream=False
                )

                roadmap = chat_completion.choices[0].message.content
                
                # Store roadmap in session for display
                session['roadmap'] = roadmap

                # Clean up the uploaded file
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Error removing file: {e}")

                # Redirect to roadmap page
                return redirect(url_for('show_roadmap'))

            except Exception as e:
                print(f"Error in roadmap generation: {e}")
                try:
                    os.remove(file_path)
                except:
                    pass
                return render_template("index.html", error=f"Error generating roadmap: {str(e)}", questions=questions)

        except Exception as e:
            print(f"Unexpected error: {e}")
            return render_template("index.html", error=f"An unexpected error occurred: {str(e)}", questions=questions)

    if request.method == "POST":
        if request.form.get('selectedField') == 'data_science':
            return render_template("index.html", roadmap=DATA_SCIENCE_DOCUMENT)

    return render_template("index.html", roadmap=None, questions=questions)

@app.route('/roadmap')
def show_roadmap():
    roadmap = session.get('roadmap')
    if not roadmap:
        return redirect(url_for('index'))
    return render_template('roadmap.html', roadmap=roadmap)

chat_history = []

@app.route("/chatbot", methods=["GET", "POST"])
def chatbot():
    global chat_history
    
    if request.method == "POST":
        try:
            user_message = request.json.get("message", "")
            
            # Add user message to chat history
            chat_history.append({"role": "user", "content": user_message})
            
            # Create system prompt that encourages structured responses
            system_prompt = """You are a career advisor helping users with their professional development. 
            Format your responses in a clear, structured way using:
            • Bullet points for lists
            • Bold text for important points using **text**
            • Separate paragraphs for different topics
            • Numbered lists for steps or sequences
            • Code blocks for technical content using ```code```
            
            Make your responses visually appealing and easy to read."""
            
            # Create the chat completion with context
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    *[{"role": msg["role"], "content": msg["content"]} for msg in chat_history]
                ],
                model="mixtral-8x7b-32768",
                temperature=0.7,
                max_tokens=2048,
                top_p=1,
                stream=False
            )
            
            # Get the assistant's response and format it
            assistant_response = chat_completion.choices[0].message.content
            
            # Add assistant response to chat history
            chat_history.append({
                "role": "assistant", 
                "content": assistant_response,
                "timestamp": datetime.now().strftime("%I:%M %p")
            })
            
            # Keep only the last 10 messages to manage context length
            if len(chat_history) > 10:
                chat_history = chat_history[-10:]
            
            return jsonify({"response": assistant_response})
            
        except Exception as e:
            print(f"Error in chatbot: {e}")
            return jsonify({"error": str(e)}), 500
    
    # For GET requests, render the chat interface
    return render_template("chat.html", chat_history=chat_history)

# @app.route('/jobs', methods=['POST'])
# def jobs_page():
#     try:
#         # Get the user's field from the request
#         field = request.json.get('field', '')

#         # Create job search prompt
#         search_prompt = f"""
#         Based on the field '{field}', please provide a list of 10 relevant job opportunities.
#         For each job, include:
#         - Job Title
#         - Required Skills
#         - Experience Level
#         - Brief Description
#         - Career Growth Potential
        
#         Format the response in a clear, structured way.
#         """

#         # Generate job listings using Groq
#         chat_completion = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "system",
#                     "content": "You are a job search assistant helping users find relevant career opportunities."
#                 },
#                 {
#                     "role": "user",
#                     "content": search_prompt
#                 }
#             ],
#             model="mixtral-8x7b-32768",
#             temperature=0.7,
#             max_tokens=2048,
#             top_p=1,
#             stream=False
#         )

#         # Extract job listings
#         job_listings = chat_completion.choices[0].message.content
#         print("Job listings response:", job_listings)

#         # Return the data as JSON for React frontend
#         return jsonify({'job_listings': job_listings})

#     except Exception as e:
#         print(f"Error in job search: {e}")
#         return jsonify({'error': str(e)}), 500
    
@app.route('/search_jobs', methods=['POST'])
def search_jobs():
    search_query = request.json.get('query', '')
    if not search_query:
        return jsonify({'error': 'Search query is required'}), 400
    
    try:
        df = load_job_data()
        
        # Create TF-IDF vectorizer
        tfidf = TfidfVectorizer(stop_words='english')
        
        # Create TF-IDF matrix
        tfidf_matrix = tfidf.fit_transform(df['combined_text'])
        
        # Transform search query
        query_vector = tfidf.transform([search_query])
        
        # Calculate cosine similarity
        cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
        
        # Get top recommendations
        related_docs_indices = cosine_similarities.argsort()[-5:][::-1]
        
        # Get recommended jobs
        recommendations = []
        for idx in related_docs_indices:
            recommendations.append({
                'title': df['Title'].iloc[idx],
                'company': df['Company'].iloc[idx],
                'description': df['jobpost'].iloc[idx],
                'email': generate_company_email(df['Company'].iloc[idx]),
                'similarity_score': float(cosine_similarities[idx])
            })
        
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route("/jobs", methods=['GET'])
# def jobs_page():
#     try:
#         # Load initial jobs (first 10)
#         df = load_job_data()
#         initial_jobs = []
#         for _, row in df.head(10).iterrows():
#             initial_jobs.append({
#                 'Job Title': row['Title'],
#                 'Company': row['Company'],
#                 'Job Description': row['jobpost'],
#                 'Email': generate_company_email(row['Company'])
#             })
#         return render_template('jobs.html', jobs=initial_jobs)
#     except Exception as e:
#         return render_template('jobs.html', jobs=[], error=str(e))

# @app.route('/search_jobs', methods=['POST'])
# def search_jobs():
#     search_query = request.json.get('query', '')
#     if not search_query:
#         return jsonify({'error': 'Search query is required'}), 400
    
#     try:
#         df = load_job_data()
        
#         # Create TF-IDF vectorizer
#         tfidf = TfidfVectorizer(stop_words='english')
        
#         # Create TF-IDF matrix
#         tfidf_matrix = tfidf.fit_transform(df['combined_text'])
        
#         # Transform search query
#         query_vector = tfidf.transform([search_query])
        
#         # Calculate cosine similarity
#         cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
        
#         # Get top recommendations
#         related_docs_indices = cosine_similarities.argsort()[-5:][::-1]
        
#         # Get recommended jobs
#         recommendations = []
#         for idx in related_docs_indices:
#             recommendations.append({
#                 'title': df['Title'].iloc[idx],
#                 'company': df['Company'].iloc[idx],
#                 'description': df['jobpost'].iloc[idx],
#                 'email': generate_company_email(df['Company'].iloc[idx]),
#                 'similarity_score': float(cosine_similarities[idx])
#             })
        
#         return jsonify({'recommendations': recommendations})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/api/generate_roadmap', methods=['POST'])
def generate_roadmap():
    try:
        selected_field = request.form.get('selectedField')
        if not selected_field:
            return jsonify({'error': 'Field not selected'}), 400

        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        # Extract text from PDF
        text = ''
        pdf_reader = PyPDF2.PdfReader(file.stream)
        for page in pdf_reader.pages:
            text += page.extract_text()

        # Generate prompt
        prompt = f"""Based on this resume:
{text}

Create a 12-week roadmap for a {selected_field} career path.
Format the response exactly as follows:

[OVERVIEW]
Brief background analysis and career goals based on the resume.

[SKILLS TO MASTER]
• Skill 1
• Skill 2
• Skill 3
(List key skills needed)

[WEEKLY BREAKDOWN]
Week 1:
📚 Learning Goals:
• Goal 1
• Goal 2

🛠️ Practical Tasks:
• Task 1
• Task 2

📖 Resources:
• Resource 1
• Resource 2

(Repeat the same structure for Weeks 2-12)
"""
        try:
            chat_completion = client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                model="mixtral-8x7b-32768",
                temperature=0.7,
                max_tokens=4096,
                top_p=1,
                stream=False
            )

            roadmap = chat_completion.choices[0].message.content
            print("Generated roadmap:", roadmap)  # Debug log

            # Store in session
            session['roadmap'] = roadmap

            return jsonify({
                'success': True,
                'roadmap': roadmap,
                'field': selected_field
            })

        except Exception as e:
            print(f"Error in roadmap generation: {e}")
            return jsonify({'error': f'Error generating roadmap: {str(e)}'}), 500

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)