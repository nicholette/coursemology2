import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import MaterialSummernote from '../../../../../../lib/components/MaterialSummernote';
import ChipInput from '../../../../../../lib/components/ChipInput';

import styles from './ScribingQuestionForm.scss';
import translations from './ScribingQuestionForm.intl';

const propTypes = {
  data: PropTypes.shape({
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
        maximum_grade: PropTypes.string,
      }),
      published_assessment: PropTypes.bool,
      attempt_limit: PropTypes.number,
    }),
    is_loading: PropTypes.bool,
    has_errors: PropTypes.bool,
    show_submission_message: PropTypes.bool,
    submission_message: PropTypes.string,
    form_data: PropTypes.shape({
      method: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      auth_token: PropTypes.string.isRequired,
    })
  }).isRequired,
  actions: React.PropTypes.shape({
    submitForm: PropTypes.func.isRequired,
    updateScribingQuestion: PropTypes.func.isRequired,
    updateSkills: PropTypes.func.isRequired,
    setValidationErrors: PropTypes.func.isRequired,
    clearHasError: PropTypes.func.isRequired,
    clearSubmissionMessage: PropTypes.func.isRequired,
  }),
  intl: intlShape.isRequired,
};

function validation(data, pathOfKeysToData, intl) {
  const errors = [];
  const questionErrors = {};
  let hasError = false;

  // Check maximum grade
  const maximumGrade = data.maximum_grade;
  if (!maximumGrade) {
    questionErrors.maximum_grade =
      intl.formatMessage(translations.cannotBeBlankValidationError);
    hasError = true;
  } else if (maximumGrade < 0) {
    questionErrors.maximum_grade =
      intl.formatMessage(translations.positiveNumberValidationError);
    hasError = true;
  }

  // Check attempt_limit
  const value = data.attempt_limit;
  if (value && value <= 0) {
    questionErrors.attempt_limit =
      intl.formatMessage(translations.lessThanEqualZeroValidationError);
    hasError = true;
  }

  if (hasError) {
    errors.push({
      path: pathOfKeysToData.concat(['error']),
      error: questionErrors,
    });
  }

  return errors;
}

class ScribingQuestionForm extends React.Component {

  static getInputName(field) {
    return `question_scribing[${field}]`;
  }

  static getInputId(field) {
    return `question_scribing_${field}`;
  }

  static convertNull(value) {
    return value === null ? '' : value;
  }

  componentDidMount() {
    this.summernoteEditors = $('#scribing-question-form .note-editor .note-editable');
  }

  componentWillReceiveProps(nextProps) {
    this.summernoteEditors.attr('contenteditable', !nextProps.data.is_loading);
  }

  onSelectSkills = (id) => {
    const currentSkills = this.props.data.question.skill_ids;
    const currentSkillsWithoutId = currentSkills.filterNot(v => v.id === id);

    if (currentSkills.size === currentSkillsWithoutId.size) {
      // id is for a new skill to be added
      const newSkill = this.props.data.question.skills
        .filter(v => v.id === id).first();

      if (newSkill) {
        this.props.actions.updateSkills(currentSkills.push(newSkill));
      }
    } else {
      // id is for a selected skill to be removed
      this.props.actions.updateSkills(currentSkillsWithoutId);
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (!this.validationCheck()) return;

    const url = this.props.data.form_data.path;
    const method = this.props.data.form_data.method;
    const formData = new FormData(this.form);

    const failureMessage = this.props.intl.formatMessage(translations.submitFailureMessage);

    this.props.actions.submitForm(url, method, formData, failureMessage);
  }

  validationCheck() {
    const { data, intl } = this.props;
    const question = data.question;
    const errors = validation(question, ['question'], intl);

    this.props.actions.setValidationErrors(errors);

    return errors.length === 0;
  }

  handleChange(field, value) {
    this.props.actions.updateScribingQuestion(field, value === '' ? null : value);
  }

  summernoteHandler(field) {
    return e => this.props.actions.updateScribingQuestion(field, e === '' ? null : e);
  }

  submitButtonText() {
    if (this.props.data.is_loading) {
      return this.props.intl.formatMessage(translations.loadingMessage);
    }

    return this.props.intl.formatMessage(translations.submitButton);
  }

  renderInputField(label, field, required, type, value, error = null, placeholder = null) {
    return (
      <div title={placeholder}>
        <TextField
          type={type}
          name={ScribingQuestionForm.getInputName(field)}
          id={ScribingQuestionForm.getInputId(field)}
          onChange={(e, newValue) => { this.handleChange(field, newValue); }}
          errorText={error}
          floatingLabelText={(required ? '* ' : '') + label}
          floatingLabelFixed
          disabled={this.props.data.is_loading}
          value={value}
          fullWidth
        />
      </div>
    );
  }

  renderSummernoteField(label, field, required, value) {
    return (
      <MaterialSummernote
        field={field}
        label={label}
        required={required}
        value={value}
        disabled={this.props.data.is_loading}
        name={ScribingQuestionForm.getInputName(field)}
        inputId={ScribingQuestionForm.getInputId(field)}
        onChange={this.summernoteHandler(field)}
      />
    );
  }

  renderMultiSelectSkillsField(label, field, value, options, error) {
    return (
      <div key={field}>
        <ChipInput
          id={ScribingQuestionForm.getInputId(field)}
          value={value}
          dataSource={options}
          dataSourceConfig={{ value: 'id', text: 'title' }}
          onRequestAdd={(chip) => { this.onSelectSkills(chip.id); }}
          onRequestDelete={this.onSelectSkills}
          floatingLabelText={label}
          floatingLabelFixed
          openOnFocus
          fullWidth
          disabled={this.props.data.is_loading}
          errorText={error}
          menuStyle={{ maxHeight: '80vh', overflowY: 'scroll' }}
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

  renderDropdownSelectField(label, field, required, value, options, error, onChange) {
    const selectOptions = options.map(opt =>
      <option value={opt.id || ''} key={opt.id}>{opt.name}</option>
    );
    const selectFieldOptions = options.map(opt =>
      <MenuItem value={opt.id} key={opt.id} primaryText={opt.name} />
    );

    return (
      <div key={field}>
        <SelectField
          floatingLabelText={(required ? '* ' : '') + label}
          floatingLabelFixed
          value={value}
          onChange={(e, key, id) => { onChange(id); }}
          disabled={this.props.data.is_loading}
          errorText={error}
          fullWidth
        >
          {selectFieldOptions}
        </SelectField>
        <select
          name={ScribingQuestionForm.getInputName(field)}
          value={value || ''}
          style={{ display: 'none' }}
          disabled={this.props.data.is_loading}
          onChange={(e) => { onChange(parseInt(e.target.value, 10) || null); }}
        >
          {selectOptions}
        </select>
      </div>
    );
  }

  render() {
    const question = this.props.data.question;
    const formData = this.props.data.form_data;
    const showAttemptLimit = true;

    const skillsOptions = question.skills;
    const skillsValues = question.skill_ids;

    return (
      <div>
        {
          this.props.data.save_errors ?
            <div className="alert alert-danger">
              {
                this.props.data.save_errors.map((errorMessage, index) => <div key={index}>{errorMessage}</div>)
              }
            </div>
            :
            null
        }
        <form
          id="scribing-question-form"
          action={formData.path}
          method="post"
          encType="multipart/form-data"
          onSubmit={this.onSubmit}
          ref={(form) => { this.form = form; }}
        >
          <input type="hidden" name="authenticity_token" value={formData.auth_token} />

          <div className={styles.inputContainer}>
            <div className={styles.titleInput}>
              {
                this.renderInputField(
                  this.props.intl.formatMessage(translations.titleFieldLabel),
                  'title', false, 'text', question.title || '',
                  this.props.data.question.error && this.props.data.question.error.title)
              }
            </div>
            <div className={styles.descriptionInput}>
              {
                this.renderSummernoteField(
                  this.props.intl.formatMessage(translations.descriptionFieldLabel),
                  'description', false, question.description || '')
              }
            </div>
            <div className={styles.staffCommentsInput}>
              {
                this.renderSummernoteField(
                  this.props.intl.formatMessage(translations.staffOnlyCommentsFieldLabel),
                  'staff_only_comments', false, question.staff_only_comments || '')
             }
            </div>
            <div className={styles.skillsInput}>
              {
                this.renderMultiSelectSkillsField(
                  this.props.intl.formatMessage(translations.skillsFieldLabel),
                  'skill_ids', skillsValues, skillsOptions,
                  this.props.data.question.error && this.props.data.question.error.skill_ids)
              }
            </div>
            <div className={styles.maximumGradeInput}>
              {
                this.renderInputField(
                  this.props.intl.formatMessage(translations.maximumGradeFieldLabel),
                  'maximum_grade', true, 'number',
                  ScribingQuestionForm.convertNull(question.maximum_grade),
                  this.props.data.question.error && this.props.data.question.error.maximum_grade)
              }
            </div>
            {
              showAttemptLimit ?
                <div className={styles.attemptLimitInput}>
                  {
                    this.renderInputField(
                      this.props.intl.formatMessage(translations.attemptLimitFieldLabel),
                      'attempt_limit', false, 'number',
                      ScribingQuestionForm.convertNull(question.attempt_limit),
                      this.props.data.question.error && this.props.data.question.error.attempt_limit,
                      this.props.intl.formatMessage(translations.attemptLimitPlaceholderMessage))
                  }
                </div>
                :
                null
            }
          </div>

          <Snackbar
            open={this.props.data.has_errors}
            message={this.props.intl.formatMessage(translations.resolveErrorsMessage)}
            autoHideDuration={5000}
            onRequestClose={() => { this.props.actions.clearHasError(); }}
          />
          <Snackbar
            open={this.props.data.show_submission_message}
            message={this.props.data.submission_message}
            autoHideDuration={2000}
            onRequestClose={() => { this.props.actions.clearSubmissionMessage(); }}
          />
          <RaisedButton
            className={styles.submitButton}
            label={this.submitButtonText()}
            labelPosition="before"
            primary
            id="scribing-question-form-submit"
            type="submit"
            disabled={this.props.data.is_loading}
            icon={this.props.data.is_loading ? <i className="fa fa-spinner fa-lg fa-spin" /> : null}
          />
        </form>
      </div>
    );
  }
}

ScribingQuestionForm.propTypes = propTypes;

export default injectIntl(ScribingQuestionForm);
