import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';

import { getScribingId } from 'lib/helpers/url-helpers';
import ScribingAnswerForm from './containers/ScribingAnswerForm';
import * as scribingAnswerActionCreators from './actions/scribingAnswerActionCreators';
import { formNames } from './constants';

function mapStateToProps({ scribingAnswer, ...state }) {
  return {
    ...state,
    scribingAnswer
  };
}

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  scribingAnswer: PropTypes.shape({
    question: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      staff_only_comments: PropTypes.string,
      maximum_grade: PropTypes.number,
      weight: PropTypes.number,
      skill_ids: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      })),
      skills: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      })),
      attachment_reference: PropTypes.shape({
        name: PropTypes.string,
        path: PropTypes.string,
        updater_name: PropTypes.string,
      }),
      error: PropTypes.shape({
        title: PropTypes.string,
        skills_id: PropTypes.string,
        maximum_grade: PropTypes.number,
      }),
      published_assessment: PropTypes.bool,
      attempt_limit: PropTypes.number,
      attachment_reference: PropTypes.shape({
        name: PropTypes.string,
        path: PropTypes.string,
        updater_name: PropTypes.string,
      })
    }),
    answer: PropTypes.shape({
      scribbles: PropTypes.arrayOf(PropTypes.shape({
        content: PropTypes.string,
      }))
    }),
    isLoading: PropTypes.bool,
  })
};

const ScribingAnswer = (props) => {
  const { dispatch, scribingAnswer } = props;
  const actions = bindActionCreators(scribingAnswerActionCreators, dispatch);
  // TODO: get scribing answer id
  return (
    <ScribingAnswerForm
      {...{
        dispatch,
        actions,
        scribingAnswer
      }}
    />
  );
};

ScribingAnswer.propTypes = propTypes;

export default connect(mapStateToProps)(ScribingAnswer);
