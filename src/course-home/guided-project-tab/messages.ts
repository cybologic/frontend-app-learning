import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  milestonesTitle: {
    id: 'learning.guidedProject.milestones.title',
    defaultMessage: 'Project Milestones',
    description: 'Title for the milestones section',
  },
  overallProgress: {
    id: 'learning.guidedProject.progress.overall',
    defaultMessage: 'Overall Progress',
    description: 'Label for overall progress',
  },
  milestonesCompleted: {
    id: 'learning.guidedProject.milestones.completed',
    defaultMessage: '{completed} / {total} milestones completed',
    description: 'Text showing number of completed milestones',
  },
  markComplete: {
    id: 'learning.guidedProject.milestone.markComplete',
    defaultMessage: 'Mark Complete',
    description: 'Button text to mark milestone as complete',
  },
  markIncomplete: {
    id: 'learning.guidedProject.milestone.markIncomplete',
    defaultMessage: 'Mark Incomplete',
    description: 'Button text to mark milestone as incomplete',
  },
  loading: {
    id: 'learning.guidedProject.loading',
    defaultMessage: 'Loading your guided project...',
    description: 'Loading message',
  },
  noProject: {
    id: 'learning.guidedProject.noProject',
    defaultMessage: 'No Guided Project Available',
    description: 'Message when no guided project exists',
  },
  congratulations: {
    id: 'learning.guidedProject.congratulations',
    defaultMessage: 'Congratulations!',
    description: 'Congratulations message for completing all milestones',
  },
  allComplete: {
    id: 'learning.guidedProject.allComplete',
    defaultMessage: 'You\'ve completed all milestones in this guided project!',
    description: 'Message when all milestones are complete',
  },
});

export default messages;
