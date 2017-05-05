import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import styles from './ScribingAnswerForm.scss';
import translations from './ScribingAnswerForm.intl';

import { fetchScribingQuestion } from '../../actions/scribingAnswerActionCreators';

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
    isLoading: PropTypes.bool,
  }),
  save_errors: PropTypes.string,
}

class ScribingAnswerForm extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;

    var answer = document.getElementById('scribing-answer');
    var scribingQuestionId = answer.dataset.scribingQuestionId;
    if (scribingQuestionId) {
      dispatch(fetchScribingQuestion(scribingQuestionId));
    }
  }

  handleImageLoaded() {

  }

  handleImageErrored() {

  }

  renderScribingImage() {
    const imagePath = this.props.scribingAnswer.question.attachment_reference.path;
    return imagePath ? 
      (
        <img
          src={window.location.origin + '\\' + imagePath}
          onLoad={this.handleImageLoaded()}
          onError={this.handleImageErrored()}
        />
      ) : [];
  }

  render() {

    return (
      <div>
        This is a placeholder message
        { this.renderScribingImage() }
      </div>
    );
  }
}

ScribingAnswerForm.propTypes = propTypes;

export default injectIntl(ScribingAnswerForm);