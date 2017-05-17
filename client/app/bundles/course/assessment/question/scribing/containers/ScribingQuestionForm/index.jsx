import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { reduxForm, Field, Form } from 'redux-form';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'lib/components/redux-form/FlatButton';

import LoadingIndicator from '../../components/LoadingIndicator';
import InputField from '../../components/InputField';
import SummernoteField from '../../components/SummernoteField';
import MultiSelectSkillsField from '../../components/MultiSelectSkillsField';
import FileUploadField from '../../components/FileUploadField';

import styles from './ScribingQuestionForm.scss';
import translations from './ScribingQuestionForm.intl';

import { fetchScribingQuestion, createScribingQuestion, updateScribingQuestion } from '../../actions/scribingQuestionActionCreators';

import { formNames } from '../../constants';
import { dataShape, questionShape } from '../../propTypes';

const propTypes = {
  actions: React.PropTypes.shape({
    submitForm: PropTypes.func.isRequired,
    createScribingQuestion: PropTypes.func.isRequired,
    updateScribingQuestion: PropTypes.func.isRequired,
  }),
  data: dataShape.isRequired,
  scribingId: PropTypes.string,
  intl: intlShape.isRequired,
  // Redux-form proptypes
  formValues: PropTypes.shape({
    scribing_question: PropTypes.shape(questionShape),
  }),
  initialValues: PropTypes.shape({
    scribing_question: PropTypes.shape(questionShape),
  }),
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

class ScribingQuestionForm extends React.Component {
  static convertNull(value) {
    return value === null ? '' : value;
  }

  componentDidMount() {
    const { scribingId } = this.props;
    const { fetchScribingQuestion } = this.props.actions;

    if (scribingId) {
      fetchScribingQuestion(scribingId);
    }
    this.summernoteEditors = $('#scribing-question-form .note-editor .note-editable');
  }

  componentWillReceiveProps(nextProps) {
    this.summernoteEditors.attr('contenteditable', !nextProps.data.is_loading);
  }

  handleCreateQuestion = (data) => {
    const { createScribingQuestion } = this.props.actions;
    return createScribingQuestion(data);
  }

  handleUpdateQuestion = (data) => {
    const { scribingId } = this.props;
    const { updateScribingQuestion } = this.props.actions;

    return updateScribingQuestion(scribingId, data);
  }

  submitButtonText() {
    const { is_submitting } = this.props.data;
    const { formatMessage } = this.props.intl;
    return (is_submitting) ? 
           formatMessage(translations.submittingMessage) :
           formatMessage(translations.submitButton);
  }

  renderErrorMessage() {
    const errors = this.props.data.save_errors;
    return errors ?
      <div className="alert alert-danger">
        { errors.map((errorMessage, index) => <div key={index}>{errorMessage}</div>)}
      </div> : null
    ;
  }

  renderExistingAttachmentLabel() {
    return (
      this.props.data.question.attachment_reference.name ? 
      <div className={styles.row}>
        <label>File uploaded: {this.props.data.question.attachment_reference.name}</label>
      </div> : []
    );
  }

  render() {
    const { handleSubmit, submitting,
            intl, scribingId } = this.props;
    const question = this.props.data.question;
    const onSubmit = scribingId ? this.handleUpdateQuestion : this.handleCreateQuestion;

    const skillsOptions = question.skills;
    const skillsValues = question.skill_ids;

    const fileName = this.props.formValues 
                    && this.props.formValues.question_scribing.attachment
                    && this.props.formValues.question_scribing.attachment[0].name;

    // Field level validations
    const required = value => (
      value ? undefined : intl.formatMessage(translations.cannotBeBlankValidationError)
    );
    const lessThan1000 = value => (
      value && value >= 1000 ?
      intl.formatMessage(translations.valueMoreThanEqual1000Error) : undefined
    );
    const nonNegative = value => (
      value && value < 0 ?
      intl.formatMessage(translations.positiveNumberValidationError) : undefined
    );

    // TODO: Display submit fail response
    return (
      (this.props.data.is_loading) ? <LoadingIndicator /> :

      <div>
        { this.renderErrorMessage() }
        <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className={styles.inputContainer}>
            <div className={styles.titleInput}>
              <InputField
                label={this.props.intl.formatMessage(translations.titleFieldLabel)}
                field={'title'}
                required={false}
                type={'text'}
                placeholder={this.props.data.question.error && this.props.data.question.error.title}
                is_loading={this.props.data.is_loading}
                value={this.props.formValues && this.props.formValues.question_scribing && this.props.formValues.question_scribing.title}
              />
            </div>
            <div className={styles.descriptionInput}>
              <SummernoteField
                label={this.props.intl.formatMessage(translations.descriptionFieldLabel)}
                field={'description'}
                is_loading={this.props.data.is_loading}
              />
            </div>
            <div className={styles.staffCommentsInput}>
              <SummernoteField
                label={this.props.intl.formatMessage(translations.staffOnlyCommentsFieldLabel)}
                field={'staff_only_comments'}
                value={this.props.formValues && this.props.formValues.question_scribing && this.props.formValues.question_scribing.staff_only_comments}
                is_loading={this.props.data.is_loading}
              />
            </div>
            <div className={styles.skillsInput}>
              <MultiSelectSkillsField
                label={this.props.intl.formatMessage(translations.skillsFieldLabel)}
                field={'skill_ids'}
                value={skillsValues}
                options={skillsOptions}
                is_loading={this.props.data.is_loading}
              />
            </div>
            <div className={styles.maximumGradeInput}>
              <InputField
                label={this.props.intl.formatMessage(translations.maximumGradeFieldLabel)}
                field={'maximum_grade'}
                required={true}
                validate={[required, lessThan1000, nonNegative]}
                type={'number'}
                is_loading={this.props.data.is_loading}
                value={ScribingQuestionForm.convertNull(this.props.formValues && this.props.formValues.question_scribing && this.props.formValues.question_scribing.maximum_grade)}
              />
            </div>
            <div className={styles.fileInputDiv}>
              { 
                this.props.data.question.attachment_reference.name ?
                this.renderExistingAttachmentLabel() :
                <div className={styles.row} >
                  <FileUploadField
                    field={'attachment'}
                    label={this.props.intl.formatMessage(translations.chooseFileButton)}
                    is_loading={this.props.data.is_loading}
                    validate={[required]}
                    fileName={fileName}
                  />
                </div>
              }
            </div>
          </div>

          <RaisedButton
            className={styles.submitButton}
            label={this.submitButtonText()}
            labelPosition="before"
            primary
            type="submit"
            onTouchTap={()=>this.props.submit()}
            disabled={this.props.data.is_loading || submitting}
            icon={this.props.data.is_submitting ? <i className="fa fa-spinner fa-lg fa-spin" /> : null}
          />
        </Form>
      </div>
    );
  }
}

ScribingQuestionForm.propTypes = propTypes;

export default reduxForm({
  form: formNames.SCRIBING_QUESTION,
  enableReinitialize: true,
})(injectIntl(ScribingQuestionForm));

