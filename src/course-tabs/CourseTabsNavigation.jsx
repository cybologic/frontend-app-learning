import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './messages';
import Tabs from '../generic/tabs/Tabs';
import { CoursewareSearch, CoursewareSearchToggle } from '../course-home/courseware-search';
import { useCoursewareSearchState } from '../course-home/courseware-search/hooks';

const CourseTabsNavigation = ({
  activeTabSlug, className, tabs,
}) => {
  const intl = useIntl();
  const { show } = useCoursewareSearchState();

  // --- DUCT TAPE FIX START ---
    useEffect(() => {
        const incorrectPathSegment = '/course/';
        const correctBasePath = '/learning/';

        // Use a short timeout to ensure React has finished rendering the DOM nodes
        const timeoutId = setTimeout(() => {
            // Find the specific "Guided Project" link using its text content
            const link = Array.from(document.querySelectorAll('.nav-underline-tabs .nav-link'))
                .find(a => a.textContent.trim() === 'Guided Project');

            if (link) {
                const currentHref = link.getAttribute('href');
                
                // Check if the URL starts with the domain/port but lacks /learning/
                if (currentHref && currentHref.includes(incorrectPathSegment) && !currentHref.includes(correctBasePath)) {
                    
                    // Split the URL based on the known incorrect starting point, which is /course/
                    // pathParts[0] = http://apps.51-112-153-31.nip.io:2000
                    // pathParts[1] = course-v1:OpenedX+DemoX+DemoCourse/guided-project
                    const parts = currentHref.split(incorrectPathSegment);

                    if (parts.length === 2) {
                        const correctedHref = `${parts[0]}${correctBasePath}course/${parts[1]}`;
                        link.setAttribute('href', correctedHref);
                        console.warn(`[DuctTapeFix] Corrected Guided Project URL to: ${correctedHref}`);
                    }
                }
            }
        }, 50); // A small delay to ensure React has updated the DOM
        
        return () => clearTimeout(timeoutId); // Cleanup the timeout
    }, []); // Empty dependency array means this runs once after initial render
    // --- DUCT TAPE FIX END ---

  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation', className)}>
      <div className="container-xl">
        <div className="nav-bar">
          <div className="nav-menu">
            <Tabs
              className="nav-underline-tabs"
              aria-label={intl.formatMessage(messages.courseMaterial)}
            >
              {tabs.map(({ url, title, slug }) => (
                <a
                  key={slug}
                  className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
                  href={url}
                >
                  {title}
                </a>
              ))}
            </Tabs>
          </div>
          <div className="search-toggle">
            <CoursewareSearchToggle />
          </div>
        </div>
      </div>
      {show && <CoursewareSearch />}
    </div>
  );
};

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default CourseTabsNavigation;
