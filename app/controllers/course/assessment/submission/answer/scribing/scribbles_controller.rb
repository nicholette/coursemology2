# frozen_string_literal: true
class Course::Assessment::Submission::Answer::Scribing::ScribblesController < \
  Course::Assessment::Submission::Answer::Scribing::Controller

  def create
    @scribble = Course::Assessment::Answer::ScribingScribble.find_by({
      creator_id: current_user.id,
      answer_id: scribble_params[:answer_id]
    })

    if @scribble
      @scribble.update_attributes(scribble_params)
    else
      @scribble = Course::Assessment::Answer::ScribingScribble.new(scribble_params)
      @scribble.save
    end

    respond_to do |format|
      format.json { render :json => @post }
    end
  end

  private

  def scribble_params
    params.require(:scribble).permit(:answer_id, :content)
  end
end
