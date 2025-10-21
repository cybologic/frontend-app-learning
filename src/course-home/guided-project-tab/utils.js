/**
 * Utility to inject the Guided Project tab into course tabs
 * This is a temporary solution until backend API includes the tab
 */

/**
 * Adds the Guided Project tab to the tabs array if it doesn't exist
 * @param {Array} tabs - The tabs array from course metadata
 * @param {string} courseId - The course ID
 * @returns {Array} - Updated tabs array with Guided Project tab
 */
export const injectGuidedProjectTab = (tabs, courseId) => {
  // Check if guided project tab already exists
  const hasGuidedProjectTab = tabs.some(tab => tab.slug === 'guided-project' || tab.slug === 'guided_project');
  
  if (hasGuidedProjectTab) {
    return tabs;
  }

  // Create the guided project tab
  const guidedProjectTab = {
    tab_id: 'guided_project',
    title: 'Guided Project',
    slug: 'guided-project',
    type: 'guided_project',
    url: `/course/${courseId}/guided-project`,
    priority: 100, // High priority to appear after main tabs
  };

  // Insert the tab (you can adjust position as needed)
  // Here we're adding it after Progress tab or at the end
  const progressIndex = tabs.findIndex(tab => tab.slug === 'progress');
  
  if (progressIndex >= 0 && progressIndex < tabs.length - 1) {
    // Insert after progress tab
    return [
      ...tabs.slice(0, progressIndex + 1),
      guidedProjectTab,
      ...tabs.slice(progressIndex + 1),
    ];
  }
  
  // Otherwise, add at the end
  return [...tabs, guidedProjectTab];
};

/**
 * Hook to use in components that need tabs with Guided Project injected
 * @param {Array} tabs - Original tabs array
 * @param {string} courseId - Course ID
 * @returns {Array} - Tabs with Guided Project injected
 */
export const useTabsWithGuidedProject = (tabs, courseId) => {
  if (!tabs || !courseId) {
    return tabs;
  }
  
  return injectGuidedProjectTab(tabs, courseId);
};
