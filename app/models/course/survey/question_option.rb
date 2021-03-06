# frozen_string_literal: true
class Course::Survey::QuestionOption < ActiveRecord::Base
  has_one_attachment

  belongs_to :question, inverse_of: :options
  has_many :answer_options, class_name: Course::Survey::AnswerOption.name,
                            inverse_of: :question_option, dependent: :destroy
end
