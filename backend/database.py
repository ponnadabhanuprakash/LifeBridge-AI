import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "students.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create students table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER UNIQUE,
            name TEXT NOT NULL,
            branch TEXT NOT NULL,
            cgpa REAL NOT NULL,
            java INTEGER NOT NULL,
            python INTEGER NOT NULL,
            web_dev INTEGER NOT NULL,
            dsa INTEGER NOT NULL,
            communication INTEGER NOT NULL,
            leadership INTEGER NOT NULL,
            projects INTEGER NOT NULL,
            internships INTEGER NOT NULL,
            certifications INTEGER NOT NULL,
            career_interest TEXT NOT NULL,
            recommended_role TEXT NOT NULL,
            package_lpa REAL NOT NULL
        )
    """)
    
    # Clear existing data to allow fresh seeding
    cursor.execute("DELETE FROM students")
    
    # Seed data
    # Student_ID, Name, Branch, CGPA, Java, Python, Web Dev, DSA, Communication, Leadership, Projects, Internships, Certifications, Career Interest, Recommended Role, Package (LPA)
    seed_data = [
        # Original 5 Students
        (101, "Rahul", "CSE", 8.5, 9, 5, 4, 9, 8, 7, 3, 1, 2, "Software Development", "Java Developer", 6.0),
        (102, "Priya", "CSE", 8.8, 5, 9, 8, 7, 9, 8, 4, 2, 3, "Data Science", "Data Scientist", 12.0),
        (103, "Arun", "IT", 7.9, 6, 5, 9, 6, 8, 8, 3, 1, 1, "Web Development", "Full Stack Developer", 7.0),
        (104, "Kiran", "CSE", 8.9, 7, 9, 5, 9, 7, 7, 4, 2, 4, "AI/ML", "Machine Learning Engineer", 15.0),
        (105, "Sneha", "IT", 8.0, 5, 6, 7, 6, 9, 9, 2, 1, 2, "Management", "Project Manager", 10.0),
        
        # Additional Synthesized Students to Train a Strong Random Forest Model
        # Java Developers
        (106, "Aditya", "CSE", 8.2, 8, 4, 5, 8, 7, 6, 2, 0, 1, "Software Development", "Java Developer", 5.5),
        (107, "Bhavna", "IT", 7.5, 7, 5, 6, 8, 8, 7, 2, 1, 1, "Software Development", "Java Developer", 5.0),
        (108, "Chaitanya", "CSE", 9.1, 10, 6, 5, 9, 8, 8, 4, 2, 3, "Software Development", "Java Developer", 9.5),
        (109, "Divya", "CSE", 6.8, 6, 4, 4, 7, 6, 6, 1, 0, 1, "Software Development", "Java Developer", 4.0),
        
        # Full Stack Developers
        (110, "Eshwar", "IT", 8.1, 5, 6, 9, 7, 8, 7, 3, 1, 2, "Web Development", "Full Stack Developer", 7.5),
        (111, "Fathima", "ECE", 7.3, 4, 5, 8, 6, 9, 8, 2, 0, 2, "Web Development", "Full Stack Developer", 5.8),
        (112, "Ganesh", "CSE", 8.7, 7, 6, 10, 8, 7, 6, 4, 2, 3, "Web Development", "Full Stack Developer", 11.0),
        (113, "Harini", "IT", 9.2, 6, 7, 9, 8, 9, 8, 4, 2, 4, "Web Development", "Full Stack Developer", 13.0),
        (114, "Ibrahim", "CSE", 6.5, 4, 4, 7, 5, 7, 6, 2, 0, 1, "Web Development", "Full Stack Developer", 4.5),
        
        # Data Scientists
        (115, "Jyothi", "CSE", 8.6, 4, 9, 6, 7, 8, 8, 3, 1, 2, "Data Science", "Data Scientist", 10.5),
        (116, "Karthik", "IT", 7.8, 5, 8, 5, 6, 7, 7, 2, 1, 1, "Data Science", "Data Scientist", 8.0),
        (117, "Lekha", "CSE", 9.4, 6, 10, 7, 8, 9, 9, 4, 2, 4, "Data Science", "Data Scientist", 16.5),
        (118, "Manish", "ECE", 8.0, 4, 8, 5, 7, 8, 7, 3, 1, 2, "Data Science", "Data Scientist", 9.0),
        
        # Machine Learning Engineers
        (119, "Naveen", "CSE", 8.9, 6, 9, 5, 9, 8, 7, 4, 2, 3, "AI/ML", "Machine Learning Engineer", 14.5),
        (120, "Oviya", "CSE", 9.5, 7, 10, 6, 10, 8, 8, 5, 3, 5, "AI/ML", "Machine Learning Engineer", 19.5),
        (121, "Pranav", "IT", 8.3, 5, 8, 4, 8, 7, 7, 3, 1, 2, "AI/ML", "Machine Learning Engineer", 11.0),
        (122, "Ritu", "ECE", 7.9, 4, 8, 5, 7, 8, 8, 2, 1, 2, "AI/ML", "Machine Learning Engineer", 9.5),
        
        # Data Analysts
        (123, "Sandeep", "IT", 7.4, 4, 7, 6, 5, 8, 7, 2, 1, 1, "Data Science", "Data Analyst", 5.5),
        (124, "Tejas", "CSE", 8.2, 5, 8, 7, 6, 8, 8, 3, 1, 2, "Data Science", "Data Analyst", 7.2),
        (125, "Uma", "IT", 8.5, 4, 9, 6, 7, 9, 8, 3, 1, 3, "Data Science", "Data Analyst", 8.5),
        (126, "Vijay", "ECE", 6.9, 3, 7, 5, 5, 7, 6, 2, 0, 1, "Data Science", "Data Analyst", 4.8),
        
        # Cybersecurity Analysts
        (127, "Wasim", "IT", 7.8, 5, 6, 4, 6, 8, 7, 2, 1, 2, "Cybersecurity", "Cybersecurity Analyst", 6.8),
        (128, "Xavier", "CSE", 8.4, 6, 7, 5, 7, 7, 7, 3, 1, 3, "Cybersecurity", "Cybersecurity Analyst", 8.5),
        (129, "Yamini", "IT", 9.0, 7, 8, 5, 8, 8, 9, 4, 2, 3, "Cybersecurity", "Cybersecurity Analyst", 12.5),
        (130, "Zoya", "ECE", 7.1, 4, 5, 4, 5, 9, 8, 2, 0, 1, "Cybersecurity", "Cybersecurity Analyst", 5.2),
        
        # DevOps Engineers
        (131, "Akash", "CSE", 8.0, 6, 7, 5, 7, 7, 8, 3, 1, 2, "Software Development", "DevOps Engineer", 8.0),
        (132, "Binu", "IT", 8.6, 5, 8, 6, 8, 8, 7, 3, 2, 3, "Software Development", "DevOps Engineer", 11.5),
        (133, "Charan", "ECE", 7.6, 4, 7, 4, 6, 8, 8, 2, 1, 2, "Software Development", "DevOps Engineer", 7.0),
        (134, "Deepa", "CSE", 9.3, 7, 9, 6, 9, 8, 8, 4, 2, 4, "Software Development", "DevOps Engineer", 14.0),
        
        # Project Managers / Tech Management
        (135, "Elango", "IT", 8.3, 5, 5, 6, 6, 10, 10, 3, 1, 3, "Management", "Project Manager", 11.0),
        (136, "Farhana", "CSE", 8.7, 6, 6, 7, 7, 9, 10, 4, 2, 4, "Management", "Project Manager", 13.5),
        (137, "Gokul", "ECE", 7.7, 4, 5, 5, 5, 9, 9, 2, 1, 2, "Management", "Project Manager", 8.5),
        (138, "Hema", "IT", 9.0, 6, 6, 8, 7, 10, 9, 3, 2, 3, "Management", "Project Manager", 14.5),
        (139, "Imran", "CSE", 7.2, 5, 4, 5, 6, 9, 9, 2, 0, 1, "Management", "Project Manager", 7.5),
        (140, "Jaya", "IT", 8.1, 5, 5, 7, 6, 9, 9, 3, 1, 2, "Management", "Project Manager", 9.8)
    ]
    
    cursor.executemany("""
        INSERT INTO students (
            student_id, name, branch, cgpa, java, python, web_dev, dsa, 
            communication, leadership, projects, internships, certifications, 
            career_interest, recommended_role, package_lpa
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, seed_data)
    
    conn.commit()
    conn.close()
    print(f"Database successfully initialized and seeded with {len(seed_data)} students at {DB_PATH}")

if __name__ == "__main__":
    init_db()
