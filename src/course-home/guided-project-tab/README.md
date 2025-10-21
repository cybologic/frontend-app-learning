# Guided Project Tab - Frontend Implementation

This directory contains the frontend implementation of the Guided Project feature for the OpenEdX Learning MFE.

## Overview

The Guided Project tab provides learners with a milestone-based tracking system for project work within their course. It displays a list of milestones that learners can mark as complete, track their progress, and see related lessons.

## Current Status

✅ **Frontend Implementation Complete** - Using mock data
⏳ **Backend Integration** - Pending (instructions below)

## Components

### Files Structure

```
guided-project-tab/
├── GuidedProjectTab.jsx       # Main component
├── GuidedProjectTab.scss      # Styles
├── messages.ts                # i18n messages
├── index.js                   # Export
└── data/
    └── mockData.js            # Mock data (temporary)
```

## Features

- **Progress Tracking**: Visual progress bar showing overall completion
- **Milestone Management**: Mark milestones as complete/incomplete
- **Related Lessons**: Expandable sections showing related course content
- **Responsive Design**: Mobile-friendly interface
- **Internationalization**: Ready for translation

## Testing Locally

### 1. Access the Tab

Once the dev server is running, navigate to:

```
http://localhost:2010/course/{course-id}/guided-project
```

For example:
```
http://localhost:2010/course/course-v1:edX+DemoX+Demo_Course/guided-project
```

### 2. Mock Data

The tab currently uses mock data defined in `data/mockData.js`. This simulates:
- A project with 10 milestones
- 2 completed milestones (20% progress)
- Related lessons for each milestone
- Completion dates and notes

### 3. Functionality

You can:
- View all project milestones
- Click "Mark Complete" to mark milestones as done
- Click "Mark Incomplete" to unmark them
- Expand/collapse related lessons
- See progress update in real-time

## Backend Integration (When Ready)

### Step 1: Update API Calls

Replace mock functions in `GuidedProjectTab.jsx`:

```javascript
// Current (mock):
const data = await fetchGuidedProjectMock(courseId);

// Replace with (real API):
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

const config = getConfig();
const client = getAuthenticatedHttpClient();
const response = await client.get(
  `${config.LMS_BASE_URL}/api/guided_projects/v1/courses/${courseId}/project`
);
const data = response.data;
```

### Step 2: Update Progress Calls

```javascript
// Current (mock):
await updateMilestoneProgressMock(milestoneId, !currentStatus);

// Replace with (real API):
await client.post(
  `${config.LMS_BASE_URL}/api/guided_projects/v1/milestones/${milestoneId}/progress`,
  { is_completed: !currentStatus }
);
```

### Step 3: Enable Tab in Course

The tab will only appear in the course navigation if the backend includes it in the course metadata. The backend needs to add this to the tabs array:

```python
{
    'tab_id': 'guided_project',
    'title': 'Guided Project',
    'url': f'/course/{course_id}/guided-project',
}
```

## Making the Tab Visible in Navigation

Currently, the tab is accessible via direct URL. To make it appear in the course navigation:

### Option 1: Backend Configuration (Recommended)

Add the tab to the course tabs in the LMS backend. The backend will include it in the course metadata API response.

### Option 2: Frontend Override (Development Only)

For local testing, you can temporarily modify the course metadata to include the tab. This is NOT recommended for production.

## Environment Variables

No additional environment variables are needed for the frontend. When the backend is ready, ensure:

```bash
LMS_BASE_URL=https://your-lms-url
```

## Customization

### Changing Mock Data

Edit `data/mockData.js` to modify:
- Project title and description
- Number of milestones
- Milestone content
- Completion status

### Styling

Modify `GuidedProjectTab.scss` to customize:
- Colors
- Spacing
- Card designs
- Responsive breakpoints

### Internationalization

Add translations in `messages.ts` for any new text strings.

## Future Enhancements

- [ ] Add API integration with backend
- [ ] Add notes editing functionality
- [ ] Add file attachments for milestones
- [ ] Add peer review features
- [ ] Add milestone dependencies
- [ ] Add notifications for milestone deadlines

## Support

For questions or issues:
1. Check the main Learning MFE README
2. Review OpenEdX documentation on MFE development
3. Contact the development team

## Related Documentation

- [OpenEdX MFE Documentation](https://github.com/openedx/frontend-build)
- [Learning MFE Architecture](../../docs/decisions/)
- [Backend Django App Guide](../../../docs/guided-projects-backend.md) (to be created)
