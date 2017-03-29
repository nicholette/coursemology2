# frozen_string_literal: true
class Course::Assessment::Question::ScribingController < \
  Course::Assessment::QuestionsController
  load_and_authorize_resource :scribing_question,
                              class: Course::Assessment::Question::Scribing,
                              through: :assessment, parent: false

  def new
    respond_to do |format|
      format.html { render 'index' }
    end
  end

  def show
    respond_to do |format|
      format.html { render 'index' }
      format.json { render_scribing_question_json }
    end
  end

  def create
    if @scribing_question.save
      render_scribing_question_json
    else
      render json: { errors: @scribing_question.errors }, status: :bad_request
    end
  end

  def edit
    respond_to do |format|
      format.html { render 'index' }
      format.json { render_scribing_question_json }
    end
  end
  
  def update
    if @scribing_question.update_attributes(scribing_question_params)
      render_scribing_question_json
    else
      render json: { errors: @scribing_question.errors }, status: :bad_request
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
      :attempt_limit,
      skill_ids: []
    )
  end
end
