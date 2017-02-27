# frozen_string_literal: true
class Course::Assessment::Question::Scribing < ActiveRecord::Base
  acts_as :question, class_name: Course::Assessment::Question.name

  has_one :document_file, class_name: Course::Assessment::Question::ScribingDocumentFile.name,
          dependent: :destroy, foreign_key: :question_id, inverse_of: :question
end
