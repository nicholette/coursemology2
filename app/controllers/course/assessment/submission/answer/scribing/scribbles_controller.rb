# frozen_string_literal: true
class Course::Assessment::Submission::Answer::Scribing::ScribblesController < \
  Course::Assessment::Submission::Answer::Scribing::Controller

  def create
    if scribble_params[':user_id'] != ""
      @scribble = Scribble.find(scribble_params['user_id'])
    else
      # clarify: take the prev answer?
      @scribble = Scribble.where({
        user_id: scribble_params[:user_id],
        answer_id: scribble_params[:answer_id]
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
    params.require(:scribble).permit(:user_id, :answer_id, :content)
  end

end
