import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { reduxForm, Field, Form } from 'redux-form';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'lib/components/redux-form/FlatButton';
import ChipInput from 'lib/components/ChipInput';

import InputField from '../../components/InputField';
import SummernoteField from '../../components/SummernoteField';

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
  static getInputName(field) {
    return `question_scribing.${field}`;
  }

  static getInputId(field) {
    return `question_scribing_${field}`;
  }

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

  shouldComponentUpdate(nextProps) {
    const fileName = this.props.formValues 
              && this.props.formValues.question_scribing.attachment 
              && this.props.formValues.question_scribing.attachment[0].name;

    const nextFileName = nextProps.formValues 
              && nextProps.formValues.question_scribing.attachment 
              && nextProps.formValues.question_scribing.attachment[0].name;

    return (this.props.data.is_loading !== nextProps.data.is_loading)
          || (fileName !== nextFileName);
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
    const { is_loading } = this.props.data;
    const { formatMessage } = this.props.intl;

    return (is_loading) ? 
           formatMessage(translations.loadingMessage) :
           formatMessage(translations.submitButton);
  }

  renderMultiSelectSkillsField(label, field, value, options, error) {
    return (
      <div key={field}>
        <Field
          name={ScribingQuestionForm.getInputName(field)}
          id={ScribingQuestionForm.getInputId(field)}
          component={props => (
            <ChipInput
              id={ScribingQuestionForm.getInputId(field)}
              value={props.input.value || []}
              dataSource={options}
              dataSourceConfig={{ value: 'id', text: 'title' }}
              onRequestAdd={(addedChip) => (
                props.input.onChange([...props.input.value, addedChip])
              )}
              onRequestDelete={(deletedChip) => {
                let values = props.input.value || [];
                values = values.filter(v => v.id !== deletedChip);
                props.input.onChange(values);
              }}
              floatingLabelText={label}
              floatingLabelFixed
              openOnFocus
              fullWidth
              disabled={this.props.data.is_loading}
              errorText={error}
              menuStyle={{ maxHeight: '80vh', overflowY: 'scroll' }}
            />
            )}
        />

        <select
          name={`${ScribingQuestionForm.getInputName(field)}[]`}
          multiple
          value={value.map(opt => opt.id)}
          style={{ display: 'none' }}
          disabled={this.props.data.is_loading}
          onChange={(e) => { this.onSelectSkills(parseInt(e.target.value, 10) || e.target.value); }}
        >
          { options.map(opt => <option value={opt.id} key={opt.id}>{opt.title}</option>) }
        </select>
      </div>
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
    // TODO: Display submitting message
    return (
      <div>
        <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className={styles.inputContainer}>
            <div className={styles.titleInput}>
              <InputField
                label={this.props.intl.formatMessage(translations.titleFieldLabel)}
                field={'title'}
                required={false}
                type={'text'}
                // value={question.title || ''}
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
                // value={question.staff_only_comments || ''}
                value={this.props.formValues && this.props.formValues.question_scribing && this.props.formValues.question_scribing.staff_only_comments}
                is_loading={this.props.data.is_loading}
              />
            </div>
            <div className={styles.skillsInput}>
              {
                this.renderMultiSelectSkillsField(
                  this.props.intl.formatMessage(translations.skillsFieldLabel),
                  'skill_ids', skillsValues, skillsOptions)
              }
            </div>
            <div className={styles.maximumGradeInput}>
              <InputField
                label={this.props.intl.formatMessage(translations.maximumGradeFieldLabel)}
                field={'maximum_grade'}
                required={true}
                validate={[required, lessThan1000, nonNegative]}
                type={'number'}
                // value={ScribingQuestionForm.convertNull(question.maximum_grade)}
                is_loading={this.props.data.is_loading}
                value={ScribingQuestionForm.convertNull(this.props.formValues && this.props.formValues.question_scribing && this.props.formValues.question_scribing.maximum_grade)}
              />
            </div>
            <div className={styles.fileInputDiv}>
              {this.props.data.question.attachment_reference.name ? 
                <div className={styles.row}>
                  <label>File uploaded: {this.props.data.question.attachment_reference.name}</label>
                </div> : []
              }
              <div className={styles.row} >
                <Field
                  name={ScribingQuestionForm.getInputName('attachment')}
                  id={ScribingQuestionForm.getInputId('attachment')}
                  disabled={this.props.data.is_loading}
                  component={props => (
                    <RaisedButton
                      className={styles.fileInputButton}
                      label={this.props.intl.formatMessage(translations.chooseFileButton)}
                      labelPosition="before"
                      containerElement="label"
                      primary
                      disabled={this.props.isLoading}
                    >
                      <input
                        id={ScribingQuestionForm.getInputId('attachment')}
                        type="file"
                        accept="image/gif, image/png, image/jpeg, image/pjpeg, application/pdf"
                        style={{display:`none`}}
                        disabled={this.props.isLoading}
                        onChange={
                          ( e ) => {
                            e.preventDefault();
                            props.input.onChange(e.target.files);
                          }
                        }
                      />
                    </RaisedButton>
                  )}
                />
                <div className={styles.fileLabel}>{fileName}</div>
              </div>
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
            icon={this.props.data.is_loading ? <i className="fa fa-spinner fa-lg fa-spin" /> : null}
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

