import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';

import ScribingQuestionForm from './containers/ScribingQuestionForm';
import * as scribingQuestionActionCreators from './actions/scribingQuestionActionCreators';
import { formNames } from './constants';
import { getScribingId } from 'lib/helpers/url-helpers';



function buildInitialValues(scribingQuestion) {
  return scribingQuestion.question ? 
    {
      question_scribing: {
        title: scribingQuestion.question.title,
        description: scribingQuestion.question.description,
        staff_only_comments: scribingQuestion.question.staff_only_comments,
        maximum_grade: scribingQuestion.question.maximum_grade,
        skills_ids: scribingQuestion.question.skills_ids,
        skills: scribingQuestion.question.skills,
        published_assessment: scribingQuestion.published_assessment,
        attempt_limit: scribingQuestion.question.attempt_limit,
      }
    } : {};
}

function mapStateToProps({scribingQuestion, ...state}) {
  console.log(buildInitialValues(scribingQuestion));
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
    question: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      staff_only_comments: PropTypes.string,
      maximum_grade: PropTypes.number,
      weight: PropTypes.number,
      skills_ids: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      })),
      skills: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        course_id: PropTypes.number,
        description: PropTypes.string,
        creator_id: PropTypes.number,
        updater_id: PropTypes.number,
        created_at: PropTypes.date,
        updated_at: PropTypes.date,
      })),
      error: PropTypes.shape({
        title: PropTypes.string,
        skills_id: PropTypes.string,
        maximum_grade: PropTypes.number,
      }),
      published_assessment: PropTypes.bool,
      attempt_limit: PropTypes.number,
    }),
    is_loading: PropTypes.bool,
  }).isRequired,
  initialValues: PropTypes.shape({
    scribing_question: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      staff_only_comments: PropTypes.string,
      maximum_grade: PropTypes.number,
      weight: PropTypes.number,
      skills_ids: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      })),
      skills: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        course_id: PropTypes.number,
        description: PropTypes.string,
        creator_id: PropTypes.number,
        updater_id: PropTypes.number,
        created_at: PropTypes.date,
        updated_at: PropTypes.date,
      })),
      published_assessment: PropTypes.bool,
      attempt_limit: PropTypes.number,
    }),
  }).isRequired,
  formValues: PropTypes.object,
  scribingId: PropTypes.string,
};


const ScribingQuestion = (props) => {
  const { dispatch, scribingQuestion, formValues, initialValues, scribingId } = props;
  const actions = bindActionCreators(scribingQuestionActionCreators, dispatch);

  return (
    <ScribingQuestionForm
      {...{
        actions,
        data: scribingQuestion,
        formValues,
        initialValues,
        scribingId,
      }}
    />
  );
};

ScribingQuestion.propTypes = propTypes;

export default connect(mapStateToProps)(ScribingQuestion);
