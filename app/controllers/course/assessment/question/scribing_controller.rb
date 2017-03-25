# frozen_string_literal: true
class Course::Assessment::Question::ScribingController < \
  Course::Assessment::QuestionsController
  load_and_authorize_resource :scribing_question,
                              class: Course::Assessment::Question::Scribing,
                              through: :assessment, parent: false

  def new
    @template = 'course/assessment/question/scribing/new.json.jbuilder'
  end

  def create
    if @scribing_question.save
      render partial: 'scribing_question', locals: { scribiing_question: @scribing_question }
    else
      render json: { errors: @scribing_question.errors }, status: :bad_request
    end
  end

  # def create
  #   @template = 'course/assessment/question/scribing/new.json.jbuilder'
  #
  #   respond_to do |format|
  #     if @scribing_question.save
  #       format.json { render_success_json t('.success'), true }
  #     else
  #       format.json { render_failure_json t('.failure') }
  #     end
  #   end
  # end
  #
  def edit
    @template = 'course/assessment/question/scribing/edit.json.jbuilder'
  end

  def update
    result = @scribing_question.class.transaction do
      @scribing_question.assign_attributes scribing_question_params
      @scribing_question.skills.clear if scribing_question_params[:skill_ids].blank?

      fail ActiveRecord::Rollback unless @scribing_question.save
      true
    end

    respond_to do |format|
      if result
        format.json { render_success_json t('.success'), false }
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

  def scribing_question_params
    params.require(:question_scribing).permit(
      :title, :description, :staff_only_comments, :maximum_grade,
      :attempt_limit,
      skill_ids: []
    )
  end

  def render_success_json(message, redirect_to_edit)
    @response = { message: message, redirect_to_edit: redirect_to_edit }

    render 'edit'
  end

  def render_failure_json(message)
    render json: { message: message, errors: @scribing_question.errors.full_messages },
           status: :bad_request
  end
end
