import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Container,
  Card,
  ProgressBar,
  Button,
  Spinner,
  Alert,
  Badge,
  Icon,
} from '@openedx/paragon';
import {
  CheckCircle,
  RadioButtonUnchecked,
  ExpandMore,
  ExpandLess,
} from '@openedx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { fetchGuidedProjectMock, updateMilestoneProgressMock } from './data/mockData';
import messages from './messages';
import './GuidedProjectTab.scss';

import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
const GuidedProjectTab = () => {
  const { courseId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingMilestone, setUpdatingMilestone] = useState(null);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const [milestoneInputs, setMilestoneInputs] = useState({}); // { [id]: { mode: 'wysiwyg'|'code', value: string } }
  const [savedDrafts, setSavedDrafts] = useState({}); // { [id]: boolean }
  const [inputVisible, setInputVisible] = useState({}); // { [id]: boolean }

  // Load saved drafts from localStorage per course
  useEffect(() => {
    try {
      const key = `guidedProjectDrafts:${courseId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setMilestoneInputs(parsed);
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [courseId]);
  const fetchProject = async () => {
    setLoading(true);
    try {
      // Using mock data for now - will be replaced with API call
      const data = await fetchGuidedProjectMock(courseId);
      setProject(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load guided project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [courseId]);

  const handleMilestoneToggle = async (milestoneId, currentStatus) => {
    setUpdatingMilestone(milestoneId);

    try {
      // Using mock update for now - will be replaced with API call
      await updateMilestoneProgressMock(milestoneId, !currentStatus);

      // Refresh project data
      await fetchProject();
    } catch (err) {
      console.error('Failed to update milestone:', err);
      setError('Failed to update milestone status');
    } finally {
      setUpdatingMilestone(null);
    }
  };

  const toggleMilestoneExpansion = (milestoneId) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const handleInputModeChange = (milestoneId, mode) => {
    setMilestoneInputs((prev) => ({
      ...prev,
      [milestoneId]: { mode, value: prev[milestoneId]?.value || '', language: prev[milestoneId]?.language || 'javascript' },
    }));
  };

  const handleInputChange = (milestoneId, value) => {
    setMilestoneInputs((prev) => ({
      ...prev,
      [milestoneId]: { mode: prev[milestoneId]?.mode || 'wysiwyg', value, language: prev[milestoneId]?.language || 'javascript' },
    }));
  };

  const handleLanguageChange = (milestoneId, language) => {
    setMilestoneInputs((prev) => ({
      ...prev,
      [milestoneId]: { ...(prev[milestoneId] || { mode: 'code', value: '' }), language },
    }));
  };

  const handleSaveDraft = (milestoneId) => {
    try {
      const key = `guidedProjectDrafts:${courseId}`;
      const next = { ...milestoneInputs };
      localStorage.setItem(key, JSON.stringify(next));
      setSavedDrafts((prev) => ({ ...prev, [milestoneId]: true }));
      setTimeout(() => {
        setSavedDrafts((prev) => ({ ...prev, [milestoneId]: false }));
      }, 1500);
    } catch (e) {
      // ignore storage errors
    }
  };

  const toggleInput = (milestoneId) => {
    setInputVisible((prev) => ({ ...prev, [milestoneId]: !prev[milestoneId] }));
    // Default mode when first opening
    setMilestoneInputs((prev) => ({
      ...prev,
      [milestoneId]: prev[milestoneId] || { mode: 'wysiwyg', value: '', language: 'javascript' },
    }));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" screenReaderText="Loading guided project" />
        <p className="mt-3">Loading your guided project...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Unable to Load Guided Project</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={fetchProject}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          <Alert.Heading>No Guided Project Available</Alert.Heading>
          <p>This course doesn't have a guided project configured yet.</p>
        </Alert>
      </Container>
    );
  }

  const progressPercentage = project.total_milestones > 0
    ? Math.round((project.completed_milestones / project.total_milestones) * 100)
    : 0;

  return (
    <Container className="guided-project-tab py-3">
      {/* Header Section */}
      <div className="project-header">
  <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h2>{project.title}</h2>
            <p className="lead">{project.description}</p>
          </div>
          <Badge className="completion-badge flex-shrink-0">
            {progressPercentage}%
          </Badge>
        </div>

        {/* Progress Overview Card */}
        <Card className="progress-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="flex-grow-1">
                <h5>Overall Progress</h5>
                <p className="small text-muted mb-0">
                  Keep going! You're making great progress on your project.
                </p>
              </div>
              <div className="text-end flex-shrink-0 ms-3">
                <div className="h4 mb-0">
                  {project.completed_milestones} <span className="text-muted" style={{ fontSize: '1.5rem' }}>/ {project.total_milestones}</span>
                </div>
                <small className="text-muted fw-medium">milestones completed</small>
              </div>
            </div>
            <ProgressBar
              now={progressPercentage}
              label={`${progressPercentage}%`}
              variant={progressPercentage === 100 ? 'success' : 'primary'}
            />
          </Card.Body>
        </Card>
      </div>

      {/* Milestones Section */}
      <div className="milestones-section">
        <h3>
          <FormattedMessage {...messages.milestonesTitle} />
        </h3>

        <div className="milestones-list">
          {project.milestones.map((milestone, index) => {
            const isExpanded = expandedMilestone === milestone.id;
            const isUpdating = updatingMilestone === milestone.id;

            return (
              <Card
                key={milestone.id}
                className={`milestone-card mb-2 ${milestone.is_completed ? 'completed' : ''} ${isUpdating ? 'updating' : ''}`}
              >
                <Card.Body>
                  <div className="d-flex align-items-start">
                    {/* Completion Icon */}
                    <div className="flex-shrink-0 me-3 milestone-icon">
                      {milestone.is_completed ? (
                        <Icon src={CheckCircle} className="text-success" style={{ fontSize: '36px' }} />
                      ) : (
                        <Icon src={RadioButtonUnchecked} className="text-muted" style={{ fontSize: '36px' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                            <Badge variant="light" className="milestone-number">
                              Milestone {index + 1}
                            </Badge>
                            {milestone.is_completed && (
                              <Badge variant="success">✓ Completed</Badge>
                            )}
                          </div>
                          <h5 className="milestone-title">
                            {milestone.title}
                          </h5>
                          <p className="milestone-description mb-0">
                            {milestone.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="d-flex align-items-start">
                          {!milestone.is_completed && (
                            <Button
                              size="sm"
                              variant={inputVisible[milestone.id] ? 'outline-primary' : 'outline-secondary'}
                              onClick={() => toggleInput(milestone.id)}
                              className="ms-0 me-2"
                            >
                              {inputVisible[milestone.id] ? 'Hide Input' : 'Add Work'}
                            </Button>
                          )}
                          <Button
                            variant={milestone.is_completed ? 'outline-secondary' : 'success'}
                            onClick={() => handleMilestoneToggle(milestone.id, milestone.is_completed)}
                            disabled={isUpdating}
                            className="ms-1 mark-complete-btn flex-shrink-0"
                          >
                            {isUpdating ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Updating...
                              </>
                            ) : milestone.is_completed ? (
                              '↶ Mark Incomplete'
                            ) : (
                              '✓ Mark Complete'
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Completion Date */}
                      {milestone.completion_date && (
                        <div className="completion-info">
                          <small>
                            ✓ Completed on {new Date(milestone.completion_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </small>
                        </div>
                      )}

                      {/* Input interface for incomplete milestones (shown on demand) */}
                      {!milestone.is_completed && inputVisible[milestone.id] && (
                        <div className="milestone-input mt-3">
                          <div className="input-toolbar d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <label className="me-2 mb-0 text-muted small">Input mode:</label>
                            <Button
                              size="sm"
                              variant={(milestoneInputs[milestone.id]?.mode || 'wysiwyg') === 'wysiwyg' ? 'primary' : 'outline-secondary'}
                              onClick={() => handleInputModeChange(milestone.id, 'wysiwyg')}
                            >
                              WYSIWYG
                            </Button>
                            <Button
                              size="sm"
                              variant={(milestoneInputs[milestone.id]?.mode || 'wysiwyg') === 'code' ? 'primary' : 'outline-secondary'}
                              onClick={() => handleInputModeChange(milestone.id, 'code')}
                            >
                              Code
                            </Button>
                            {(milestoneInputs[milestone.id]?.mode || 'wysiwyg') === 'code' && (
                              <div className="ms-2 d-flex align-items-center">
                                <label className="me-2 mb-0 text-muted small">Language:</label>
                                <select
                                  className="form-select form-select-sm language-select"
                                  value={milestoneInputs[milestone.id]?.language || 'javascript'}
                                  onChange={(e) => handleLanguageChange(milestone.id, e.target.value)}
                                >
                                  <option value="javascript">JavaScript</option>
                                  <option value="python">Python</option>
                                  <option value="sql">SQL</option>
                                  <option value="json">JSON</option>
                                  <option value="markup">HTML</option>
                                </select>
                              </div>
                            )}
                          </div>

                          {(milestoneInputs[milestone.id]?.mode || 'wysiwyg') === 'wysiwyg' ? (
                            <ReactQuill
                              theme="snow"
                              value={milestoneInputs[milestone.id]?.value || ''}
                              onChange={(val) => handleInputChange(milestone.id, val)}
                              placeholder="Describe your work, steps taken, or attach notes here..."
                              className="mb-2"
                            />
                          ) : (
                            <div className="code-editor-wrapper mb-2">
                              {(() => {
                                const codeVal = milestoneInputs[milestone.id]?.value || '';
                                const lang = milestoneInputs[milestone.id]?.language || 'javascript';
                                const prismLang = Prism.languages[lang] || Prism.languages.javascript;
                                const lineCount = Math.max(1, codeVal.split('\n').length);
                                return (
                                  <div className="code-editor-inner">
                                    <div className="code-gutter" aria-hidden>
                                      {Array.from({ length: lineCount }).map((_, i) => (
                                        <div className="line-number" key={i}>{i + 1}</div>
                                      ))}
                                    </div>
                                    <div className="code-area">
                                      {!codeVal && (
                                        <span className="editor-placeholder">Type your code here...</span>
                                      )}
                                      <Editor
                                        value={codeVal}
                                        onValueChange={(code) => handleInputChange(milestone.id, code)}
                                        highlight={(code) => Prism.highlight(code, prismLang, lang)}
                                        padding={12}
                                        style={{
                                          fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                          fontSize: 13,
                                          background: 'transparent',
                                          color: '#2d3748',
                                          minHeight: 140,
                                          lineHeight: 1.5,
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          <div className="action-buttons d-flex justify-content-end align-items-center gap-2 mt-2">
                            <Button size="sm" variant="secondary" onClick={() => handleInputChange(milestone.id, '')}>
                              Clear
                            </Button>
                            <Button size="sm" variant="primary" onClick={() => handleSaveDraft(milestone.id)}>
                              Save Draft
                            </Button>
                            {savedDrafts[milestone.id] && (
                              <small className="text-success ms-2">Draft saved</small>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expandable Details */}
                      {milestone.relatedLessons && milestone.relatedLessons.length > 0 && (
                        <div className="milestone-details">
                          <Button
                            variant="link"
                            onClick={() => toggleMilestoneExpansion(milestone.id)}
                            className="p-0"
                          >
                            <Icon src={isExpanded ? ExpandLess : ExpandMore} className="me-1" style={{ fontSize: '18px' }} />
                            {isExpanded ? 'Hide' : 'Show'} related lessons ({milestone.relatedLessons.length})
                          </Button>

                          {isExpanded && (
                            <div className="related-lessons p-3 mt-3">
                              <strong className="d-block mb-3">📚 Related Lessons:</strong>
                              <ul className="mb-0">
                                {milestone.relatedLessons.map((lesson, idx) => (
                                  <li key={idx}>{lesson}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {milestone.notes && (
                        <div className="milestone-notes p-3">
                          <small>
                            <strong>📝 Notes:</strong> {milestone.notes}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <Alert variant="success" className="mt-4">
          <Alert.Heading>🎉 Congratulations!</Alert.Heading>
          <p className="mb-0">
            You've completed all milestones in this guided project! Great work on building your full-stack application.
            Keep up the excellent work!
          </p>
        </Alert>
      )}
    </Container>
  );
};

GuidedProjectTab.propTypes = {
  courseId: PropTypes.string,
};

export default GuidedProjectTab;
