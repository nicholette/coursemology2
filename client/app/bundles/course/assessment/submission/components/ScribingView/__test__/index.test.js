import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import ProviderWrapper from 'lib/components/ProviderWrapper';
import CourseAPI from 'api/course';
import store from 'course/assessment/submission/store';
import ScribingView from 'course/assessment/submission/containers/ScribingView';
import actionTypes, { canvasActionTypes, scribingToolColor,
       scribingPopoverTypes } from '../../../constants';
import { updateScribingAnswer } from '../../../actions/scribing';

const assessmentId = 1;
const submissionId = 2;
const answerId = 3;

const mockSubmission = {
  submission: {
    attemptedAt: '2017-05-11T15:38:11.000+08:00',
    basePoints: 1000,
    canGrade: true,
    canUpdate: true,
    isCreator: false,
    late: false,
    maximumGrade: 70,
    pointsAwarded: null,
    submittedAt: '2017-05-11T17:02:17.000+08:00',
    submitter: 'Jane',
    workflowState: 'submitted',
  },
  assessment: {},
  annotations: [],
  posts: [],
  questions: [],
  topics: [],
  answers: [{
    fields: {
      id: answerId,
      questionId: 1,
    },
    grading: {
      grade: null,
      id: answerId,
    },
    questionId: 1,
    scribing_answer: {
      answer_id: 23,
      image_path: '/attachments/image1',
      scribbles: [],
      user_id: 10,
    },
  }],
};

describe('ScribingView', () => {
  it('renders canvas', async () => {
    store.dispatch({
      type: actionTypes.FETCH_SUBMISSION_SUCCESS,
      payload: mockSubmission,
    });
    store.dispatch({
      type: actionTypes.SET_CANVAS_LOADED,
      payload: { answerId, loaded: true, canvas: {} },
    });

    const editPage = mount(
      <ProviderWrapper store={store}>
        <MemoryRouter
          initialEntries={[`/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}/edit`]}
        >
          <ScribingView answerId={answerId} />
        </MemoryRouter>
      </ProviderWrapper>
    );
    expect(editPage.find('canvas').length).toBe(1);
  });


  it('renders tool popovers', async () => {
    const mockAnchor = {
      getBoundingClientRect: jest.fn(),
    };
    mockAnchor.getBoundingClientRect.mockReturnValue({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
    });

    const editPage = mount(
      <ProviderWrapper store={store}>
        <MemoryRouter
          initialEntries={[`/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}/edit`]}
        >
          <ScribingView answerId={answerId} />
        </MemoryRouter>
      </ProviderWrapper>
    );

    store.dispatch({
      type: canvasActionTypes.OPEN_POPOVER,
      payload: { answerId, popoverType: scribingPopoverTypes.DRAW, popoverAnchor: mockAnchor },
    });
    expect(editPage.find('DrawPopover').prop('open')).toEqual(true);

    store.dispatch({
      type: canvasActionTypes.CLOSE_POPOVER,
      payload: { answerId, popoverType: scribingPopoverTypes.DRAW },
    });
    expect(editPage.find('DrawPopover').prop('open')).toEqual(false);
  });


  it('sets the color from the color picker', async () => {
    const editPage = mount(
      <ProviderWrapper store={store}>
        <MemoryRouter
          initialEntries={[`/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}/edit`]}
        >
          <ScribingView answerId={answerId} />
        </MemoryRouter>
      </ProviderWrapper>
    );

    store.dispatch({
      type: canvasActionTypes.SET_COLORING_TOOL_COLOR,
      payload: { answerId, coloringTool: scribingToolColor.TYPE, color: 'rgba(231,12,12,1)' },
    });
    expect(editPage.find('TypePopover').prop('colorPickerColor')).toEqual('rgba(231,12,12,1)');
    expect(editPage.find('ToolDropdown').first().prop('colorBar')).toEqual('rgba(231,12,12,1)');
  });


  it('sets the saving status', async () => {
    const editPage = mount(
      <ProviderWrapper store={store}>
        <MemoryRouter
          initialEntries={[`/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}/edit`]}
        >
          <ScribingView answerId={answerId} />
        </MemoryRouter>
      </ProviderWrapper>
    );

    store.dispatch({
      type: actionTypes.UPDATE_SCRIBING_ANSWER_REQUEST,
      payload: { answerId },
    });
    expect(editPage.find('SavingIndicator').prop('isSaving')).toEqual(true);


    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: `/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}/edit`,
    });

    // Mock assessment axios
    const client = CourseAPI.answer.scribing.scribings.getClient();
    const mock = new MockAdapter(client);
    mock.onPost(`/courses/${courseId}/assessments/${assessmentId}\
/submissions/${submissionId}/answers/${answerId}/scribing/scribbles`)
      .reply(200);
    const spyUpdate = jest.spyOn(CourseAPI.answer.scribing.scribings, 'update');

    store.dispatch(updateScribingAnswer(answerId, {}));

    await sleep(1);
    expect(spyUpdate).toHaveBeenCalled();
    expect(editPage.find('SavingIndicator').prop('isSaved')).toEqual(true);
  });
});
