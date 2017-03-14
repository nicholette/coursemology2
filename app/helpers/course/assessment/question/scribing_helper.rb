# frozen_string_literal: true
module Course::Assessment::Question::ScribingHelper
  # Displays the result alert for an import job.
  #
  # @return [String] If there is an import job for the question.
  # @return [nil] If there is no import job for the question.
  def import_result_alert(json: false)
    import_job = @scribing_question.import_job

    return json ? {} : nil unless import_job

    if import_job.completed?
      successful_import_alert(json: json)
    elsif import_job.errored?
      errored_import_alert(json: json)
    end
  end

  # Checks if the import job errored.
  #
  # @return [Boolean]
  def import_errored?
    !@scribing_question.import_job.nil? && @scribing_question.import_job.errored?
  end

  # Determines if the scribing question errors should be displayed.
  #
  # @return [Boolean]
  def display_validation_errors?
    @scribing_question.errors.present?
  end

  # Displays the validation errors alert for scribing question.
  #
  # @return [String] If there are validation errors for the question.
  # @return [nil] If there are no validation errors for the question.
  def validation_errors_alert
    return nil if @scribing_question.errors.empty?

    content_tag(:div, class: ['alert', 'alert-danger']) do
      messages = @scribing_question.errors.full_messages.map do |message|
        content_tag(:div, message)
      end

      safe_join messages
    end
  end

  # def check_import_job?
  #   @scribing_question.import_job && @scribing_question.import_job.status != 'completed'
  # end

  private

  # def successful_import_alert(json: false)
  #   klass = ['alert', 'alert-success']
  #   message = t('course.assessment.question.scribing.form.import_result.success')
  #
  #   if json
  #     { class: klass.join(' '), message: message }
  #   else
  #     content_tag(:div, class: klass) do
  #       message
  #     end
  #   end
  # end
  #
  # def errored_import_alert(json: false)
  #   klass = ['alert', 'alert-danger']
  #   message = t('course.assessment.question.scribing.form.import_result.error',
  #               error: import_error_message(@scribing_question.import_job.error))
  #
  #   if json
  #     { class: klass.join(' '), message: message }
  #   else
  #     content_tag(:div, class: klass) do
  #       message
  #     end
  #   end
  # end

end
