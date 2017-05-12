# frozen_string_literal: true
class Course::Assessment::Answer::ScribingScribble < ActiveRecord::Base
  belongs_to :answer, class_name: Course::Assessment::Answer::Scribing.name, inverse_of: :scribbles
  belongs_to :user, inverse_of: nil, foreign_key: true
end
