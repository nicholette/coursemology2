# frozen_string_literal: true
class Course::Assessment::Question::ScribingDocumentFile < ActiveRecord::Base
  belongs_to :question, class_name: Course::Assessment::Question::Scribing.name,
             inverse_of: :document_file
end
