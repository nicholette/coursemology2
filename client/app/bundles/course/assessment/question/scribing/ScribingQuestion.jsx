import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';

import { getScribingId } from 'lib/helpers/url-helpers';
import ScribingQuestionForm from './containers/ScribingQuestionForm';
import * as scribingQuestionActionCreators from './actions/scribingQuestionActionCreators';
import { formNames } from './constants';
import { questionShape } from './propTypes';


function buildInitialValues(scribingQuestion) {
  return scribingQuestion.question ?
  {
    question_scribing: {
      title: scribingQuestion.question.title,
      description: scribingQuestion.question.description,
      staff_only_comments: scribingQuestion.question.staff_only_comments,
      maximum_grade: scribingQuestion.question.maximum_grade,
      skill_ids: scribingQuestion.question.skill_ids,
      published_assessment: scribingQuestion.published_assessment,
      attempt_limit: scribingQuestion.question.attempt_limit,
    },
  } : {};
}

function mapStateToProps({ scribingQuestion, ...state }) {
  return {
    ...state,
    scribingQuestion,
    initialValues: buildInitialValues(scribingQuestion),
    formValues: getFormValues(formNames.SCRIBING_QUESTION)(state),
    scribingId: getScribingId(),
  };
}

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  scribingQuestion: PropTypes.shape({
    question: questionShape,
    is_loading: PropTypes.bool,
  }).isRequired,
  formValues: PropTypes.shape({
    scribing_question: PropTypes.shape(questionShape),
  }),
  initialValues: PropTypes.shape({
    scribing_question: PropTypes.shape(questionShape),
  }),
  scribingId: PropTypes.string,
};


const ScribingQuestion = (props) => {
  const { dispatch, scribingQuestion, formValues, initialValues, scribingId } = props;
  const actions = bindActionCreators(scribingQuestionActionCreators, dispatch);

  return (
    <ScribingQuestionForm
        actions={actions}
        data={scribingQuestion}
        formValues={formValues}
        initialValues={initialValues}
        scribingId={scribingId}
    />
  );
};

ScribingQuestion.propTypes = propTypes;

export default connect(mapStateToProps)(ScribingQuestion);
