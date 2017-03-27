import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';

import ScribingQuestionForm from './containers/ScribingQuestionForm';
import * as scribingQuestionActionCreators from './actions/scribingQuestionActionCreators';
import { formNames } from './constants';


function mapStateToProps({scribingQuestion, ...state}) {
  return {
    ...state,
    scribingQuestion,
    formValues: getFormValues(formNames.SCRIBING_QUESTION)(state),
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
      published_assessment: PropTypes.bool,
      attempt_limit: PropTypes.number,
    }),
  }).isRequired,
  formValues: PropTypes.object,
};


const ScribingQuestion = (props) => {
  const { dispatch, scribingQuestion, formValues } = props;
  const actions = bindActionCreators(scribingQuestionActionCreators, dispatch);

  return (
    <ScribingQuestionForm
      {...{
        actions,
        data: scribingQuestion,
        formValues,
      }}
    />
  );
};

ScribingQuestion.propTypes = propTypes;

export default connect(mapStateToProps)(ScribingQuestion);
