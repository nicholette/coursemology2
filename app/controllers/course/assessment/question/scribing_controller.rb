# frozen_string_literal: true
# rubocop:disable Metrics/ClassLength
class Course::Assessment::Question::ScribingController < \
  Course::Assessment::QuestionsController
  load_and_authorize_resource :scribing_question,
                              class: Course::Assessment::Question::Scribing,
                              through: :assessment, parent: false

  include CarrierWave::MiniMagick

  def new
    respond_to do |format|
      format.html { render 'new' }
    end
  end

  def show
    respond_to do |format|
      format.json { render_scribing_question_json }
    end
  end

  def create
    # special handling for PDF files
    respond_to do |format|
      if file_for_uploading? && scribing_question_creator_service(scribing_question_params[:file]).save_question
        format.json { render_success_json t('.success') }
      else
        format.json { render_failure_json t('.failure') }
      end
    end
  end

  def edit
    respond_to do |format|
      format.html { render 'edit' }
      format.json { render_scribing_question_json }
    end
  end

  def update
    # TODO: Handle updating of attachments in scribing question
    # Don't allow the user to edit attachment at the moment
    # in case the user uploads a multipage pdf to replace
    respond_to do |format|
      if @scribing_question.update(scribing_question_update_params)
        format.json { render_scribing_question_json }
      else
        format.json { render_failure_json t('.failure') }
      end
    end
  end

  def destroy
    if @scribing_question.destroy
      redirect_to course_assessment_path(current_course, @assessment),
                  success: t('.success')
    else
      error = @scribing_question.errors.full_messages.to_sentence
      redirect_to course_assessment_path(current_course, @assessment),
                  danger: t('.failure', error: error)
    end
  end

  private

  def render_scribing_question_json
    render partial: 'scribing_question', locals: { scribing_question: @scribing_question }
  end

  def scribing_question_params
    params.require(:question_scribing).permit(
      :title, :description, :staff_only_comments, :maximum_grade,
      attachment_params, skill_ids: []
    )
  end

  # Don't allow uploading of files at the moment
  def scribing_question_update_params
    params.require(:question_scribing).permit(
      :title, :description, :staff_only_comments, :maximum_grade,
      skill_ids: []
    )
  end

  def render_success_json(message)
    render json: { message: message },
           status: :ok
  end

  def render_failure_json(message)
    render json: { message: message, errors: @scribing_question.errors.full_messages },
           status: :bad_request
  end

  # Check whether the file types are allowed
  def file_for_uploading?
    allowed_file_types = ['image/gif', 'image/png', 'image/jpeg', 'image/pjpeg', 'application/pdf']
    allowed_file_types.include? scribing_question_params.dig(:file)&.content_type&.downcase
  end

  def scribing_question_creator_service(file)
    max_weight = @assessment.questions.pluck(:weight).max
    @service ||= Course::Assessment::Question::Scribing::ScribingQuestionCreatorService.new(
      @scribing_question, file, current_user, @assessment
    )
  end
end
