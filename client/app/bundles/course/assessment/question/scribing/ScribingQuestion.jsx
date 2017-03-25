import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';

import ScribingQuestionForm from './components/ScribingQuestionForm';
import * as scribingQuestionActionCreators from './actions/scribingQuestionActionCreators';
import { formNames } from './constants/scribingQuestionConstants';


function mapStateToProps(scribingQuestion, state) {
  return {
    ...state,
    scribingQuestion,
    formValues: getFormValues(formNames.SCRIBING_QUESTION)(state),
  };
}

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  scribingQuestion: PropTypes.shape({
    // question: PropTypes.shape({
      // id: PropTypes.number,
      // title: PropTypes.string,
      // description: PropTypes.string,
      // staff_only_comments: PropTypes.string,
      // maximum_grade: PropTypes.number,
      // weight: PropTypes.number,
      // skills_ids: PropTypes.arrayOf(PropTypes.shape({
      //   id: PropTypes.number,
      //   title: PropTypes.string,
      // })),
      // skills: PropTypes.arrayOf(PropTypes.shape({
      //   id: PropTypes.number,
      //   title: PropTypes.string,
      //   course_id: PropTypes.number,
      //   description: PropTypes.string,
      //   creator_id: PropTypes.number,
      //   updater_id: PropTypes.number,
      //   created_at: PropTypes.date,
      //   updated_at: PropTypes.date,
      // })),
      // published_assessment: PropTypes.bool,
      // attempt_limit: PropTypes.number,
    // }),
    // is_loading: PropTypes.bool,
    // has_errors: PropTypes.bool,
    // show_submission_message: PropTypes.bool,
    // submission_message: PropTypes.string,
    // form_data: PropTypes.shape({
    //   method: PropTypes.string,
    //   path: PropTypes.string,
    //   auth_token: PropTypes.string,
    // }),
    // handleSubmit: PropTypes.func.isRequired,
    // onSubmit: PropTypes.func.isRequired,
    // intl: intlShape.isRequired,
    // disabled: PropTypes.bool,
  }).isRequired,
  formValues: PropTypes.object,
};


const ScribingQuestion = (props) => {
  const { dispatch, scribingQuestion, formValues } = props;
  const actions = bindActionCreators(scribingQuestionActionCreators, dispatch);

  // Temporary onSubmit to view form data.
  const showResults = (values) => {
    new Promise(resolve => {
      setTimeout(() => {  // simulate server latency
        window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
        resolve()
      }, 500)
    })
  }

  return (
    <ScribingQuestionForm
      {...{
        actions,
        data: scribingQuestion,
        formValues,
      }}
      onSubmit = {showResults}
    />
  );
};

ScribingQuestion.propTypes = propTypes;

export default connect(mapStateToProps)(ScribingQuestion);
