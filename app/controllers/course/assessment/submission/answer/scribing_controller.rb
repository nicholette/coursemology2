# frozen_string_literal: true
class Course::Assessment::Submission::Answer::ScribingController < \
  Course::Assessment::Submission::Answer::Controller

  before_action :set_scribing_answer
  load_resource :scribbles, class: Course::Assessment::Answer::ScribingScribble.name,
                       through: :scribing_answer

  # interim solution, to be removed before integration
  def show
    respond_to do |format|
      format.json { render_scribing_answer_json }
    end
  end

  # # interim solution, to be removed before integration
  # def update
  #   # delete exisiting scribbles
  #   Course::Assessment::Answer::ScribingScribble.delete_all "scribing_answer_id = #{@scribing_answer.id}"

  #   params[:scribing_answer][:scribbles].each { |scribble|
  #     newScribble = Course::Assessment::Answer::ScribingScribble.new
  #     newScribble.content = scribble
  #     newScribble.scribing_answer_id = @scribing_answer.id
  #     newScribble.save
  #   }

  #   respond_to do |format|
  #     format.json { render_scribing_answer_json }
  #   end
  # end

  private

  def set_scribing_answer
    @scribing_answer = @actable
    remove_instance_variable(:@actable)
  end

  # interim solution, anything below to be removed before integration
  def render_scribing_answer_json
    render partial: 'scribing_answer', locals: { scribing_answer: @scribing_answer }
  end

  def scribing_answer_params
    params.require(:scribing_answer).permit(
      scribbles: []
    )
  end

  def render_success_json(message)
    render json: { message: message },
           status: :ok
  end

  def render_failure_json(message)
    render json: { message: message, errors: @scribing_answer.errors.full_messages },
           status: :bad_request
  end

end
