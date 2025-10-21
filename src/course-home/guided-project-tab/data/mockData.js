/**
 * Mock data for Guided Project Tab
 * This will be replaced with API calls later
 */

export const mockGuidedProject = {
  id: 1,
  title: 'Build a Full-Stack Web Application',
  description: 'Throughout this course, you\'ll build a complete web application step-by-step. Each milestone corresponds to key lessons and will guide you through the development process.',
  milestones: [
    {
      id: 1,
      title: 'Set Up Development Environment',
      description: 'Install necessary tools including Node.js, VS Code, and Git. Initialize your project repository and set up version control.',
      order: 1,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@setup',
      is_completed: true,
      completion_date: '2025-10-15T10:30:00Z',
      notes: 'Completed all setup steps successfully',
      relatedLessons: ['Week 1: Introduction to Development', 'Week 1: Tools and Environment'],
    },
    {
      id: 2,
      title: 'Create Project Structure',
      description: 'Design and implement the basic folder structure for your application. Set up frontend and backend directories with proper organization.',
      order: 2,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@structure',
      is_completed: true,
      completion_date: '2025-10-16T14:20:00Z',
      notes: 'Used MVC pattern for organization',
      relatedLessons: ['Week 2: Project Architecture', 'Week 2: Best Practices'],
    },
    {
      id: 3,
      title: 'Build Database Schema',
      description: 'Design your database schema, create models, and set up database connections. Implement basic CRUD operations.',
      order: 3,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@database',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 3: Database Design', 'Week 3: SQL Basics', 'Week 3: ORMs'],
    },
    {
      id: 4,
      title: 'Implement Authentication',
      description: 'Add user registration and login functionality. Implement JWT-based authentication and session management.',
      order: 4,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@auth',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 4: Authentication', 'Week 4: Security Best Practices'],
    },
    {
      id: 5,
      title: 'Create API Endpoints',
      description: 'Build RESTful API endpoints for your application. Implement proper error handling and validation.',
      order: 5,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@api',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 5: REST APIs', 'Week 5: API Design Patterns'],
    },
    {
      id: 6,
      title: 'Design User Interface',
      description: 'Create responsive UI components using React. Implement routing and state management.',
      order: 6,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@frontend',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 6: React Fundamentals', 'Week 6: Component Design'],
    },
    {
      id: 7,
      title: 'Integrate Frontend with Backend',
      description: 'Connect your React frontend to the backend API. Implement data fetching and state updates.',
      order: 7,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@integration',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 7: API Integration', 'Week 7: Async Operations'],
    },
    {
      id: 8,
      title: 'Add Testing',
      description: 'Write unit tests and integration tests for both frontend and backend. Achieve at least 80% code coverage.',
      order: 8,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@testing',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 8: Testing Fundamentals', 'Week 8: Test-Driven Development'],
    },
    {
      id: 9,
      title: 'Deploy Application',
      description: 'Deploy your application to a cloud platform. Set up CI/CD pipeline for automatic deployments.',
      order: 9,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@deploy',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 9: Deployment Strategies', 'Week 9: DevOps Basics'],
    },
    {
      id: 10,
      title: 'Final Project Presentation',
      description: 'Create a demo video and documentation for your project. Present your work and reflect on your learning journey.',
      order: 10,
      unit_id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@final',
      is_completed: false,
      completion_date: null,
      notes: '',
      relatedLessons: ['Week 10: Project Documentation', 'Week 10: Presentation Skills'],
    },
  ],
  total_milestones: 10,
  completed_milestones: 2,
};

/**
 * Simulates API call to fetch guided project
 */
export const fetchGuidedProjectMock = (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGuidedProject);
    }, 500); // Simulate network delay
  });
};

/**
 * Simulates API call to update milestone progress
 */
export const updateMilestoneProgressMock = (milestoneId, isCompleted, notes = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const milestone = mockGuidedProject.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.is_completed = isCompleted;
        milestone.notes = notes;
        milestone.completion_date = isCompleted ? new Date().toISOString() : null;
        
        // Update completion count
        mockGuidedProject.completed_milestones = mockGuidedProject.milestones.filter(
          m => m.is_completed
        ).length;
      }
      resolve({ success: true, milestone });
    }, 300);
  });
};
