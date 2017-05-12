# frozen_string_literal: true
class Course::Assessment::Answer::Scribing < ActiveRecord::Base
  acts_as :answer, class_name: Course::Assessment::Answer.name
  has_many :scribbles, class_name: Course::Assessment::Answer::ScribingScribble.name,
                        dependent: :destroy, foreign_key: :answer_id, inverse_of: :answer

  after_initialize :set_default

  def to_partial_path
    'course/assessment/answer/scribing/scribing'
  end

  # Specific implementation of Course::Assessment::Answer#reset_answer
  def reset_answer
    self.content = ''
    scribbles.clear
    save
    acting_as
  end

  private

  def set_default
    self.content ||= ''
  end

end
