# frozen_string_literal: true
class Course::Assessment::Question::ScribingController < \
  Course::Assessment::QuestionsController
  load_and_authorize_resource :scribing_question,
                              class: Course::Assessment::Question::Scribing,
                              through: :assessment, parent: false

  def new
    respond_to do |format|
      format.html { render 'index' }
      # format.json { render partial: 'scribing_question', locals: { scribing_question: @scribing_question } }
    end
  end

  def show
    respond_to do |format|
      format.html { render 'index' }
      format.json { render partial: 'scribing_question', locals: { scribing_question: @scribing_question } }
    end
  end

  def create
    if @scribing_question.save
      render partial: 'scribing_question', locals: { scribing_question: @scribing_question }
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
    respond_to do |format|
      format.html { render 'index' }
      format.json { render_existing_scribing_question }
    end
  end
  
  def update
    if @scribing_question.update_attributes(scribing_question_params)
      render partial: 'scribing_question', locals: { scribing_question: @scribing_question }
    else
      render json: { errors: @scribing_question.errors }, status: :bad_request
    end
  end

  # def update
  #   result = @scribing_question.class.transaction do
  #     @scribing_question.assign_attributes scribing_question_params
  #     @scribing_question.skills.clear if scribing_question_params[:skill_ids].blank?

  #     fail ActiveRecord::Rollback unless @scribing_question.save
  #     true
  #   end

  #   respond_to do |format|
  #     if result
  #       format.json { render_success_json t('.success'), false }
  #     else
  #       format.json { render_failure_json t('.failure') }
  #     end
  #   end
  # end

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
  
  
  # def destroy
  #   if @scribing_question.destroy
  #     head :ok
  #     redirect_to course_assessment_path(current_course, @assessment)
  #   else
  #     head :bad_request
  #   end
  # end

  private

  def render_existing_scribing_question_json
    render partial: 'existing_scribing_question', locals: { scribing_question: @scribing_question }
  end

  def scribing_question_params
    params.require(:question_scribing).permit(
      :title, :description, :staff_only_comments, :maximum_grade,
      :attempt_limit,
      skill_ids: []
    )
  end

  # def render_success_json(message, redirect_to_edit)
  #   @response = { message: message, redirect_to_edit: redirect_to_edit }

  #   render 'edit'
  # end

  # def render_failure_json(message)
  #   render json: { message: message, errors: @scribing_question.errors.full_messages },
  #          status: :bad_request
  # end
end
