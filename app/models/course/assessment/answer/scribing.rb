# frozen_string_literal: true
class Course::Assessment::Answer::Scribing < ActiveRecord::Base
  acts_as :answer, class_name: Course::Assessment::Answer.name
  has_many :scribbles, class_name: Course::Assessment::Answer::ScribingScribble.name,
                        dependent: :destroy, foreign_key: :scribing_id, inverse_of: :scribing

  def to_partial_path
    'course/assessment/answer/scribing/scribing'
  end

end
