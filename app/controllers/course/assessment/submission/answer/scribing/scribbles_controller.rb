# frozen_string_literal: true
class Course::Assessment::Submission::Answer::Scribing::ScribblesController < \
  Course::Assessment::Submission::Answer::Scribing::Controller

  def create
    if scribble_params['id'] != ""
      @scribble = Scribble.find(scribble_params['id'])
    else
      # clarify: take the prev answer?
      @scribble = Scribble.where({
        std_course_id: scribble_params[:std_course_id],
        scribing_answer_id: scribble_params[:scribing_answer_id]
      }).first
    end
    if @scribble
      @scribble.update_attributes(scribble_params)
    else
      @scribble = Scribble.new(scribble_params)
      @scribble.save
    end

    respond_to do |format|
      format.json { render :json => @post }
    end
  end

  private

  def scribble_params
    params.require(:scribble).permit(:id, :scribing_answer_id, :content)
  end

end
