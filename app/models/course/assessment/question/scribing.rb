# frozen_string_literal: true
class Course::Assessment::Question::Scribing < ActiveRecord::Base

  # # The table name for this model is singular.
  # self.table_name = table_name.singularize

  acts_as :question, class_name: Course::Assessment::Question.name

  # has_one :document_file, class_name: Course::Assessment::Question::ScribingDocumentFile.name,
  #         dependent: :destroy, foreign_key: :question_id, inverse_of: :question

  def to_partial_path
    'course/assessment/question/scribing/scribing'.freeze
  end

  def attempt(submission, last_attempt = nil)
    answer = submission.scribing_answers.build(submission: submission, question: question)
    if last_attempt
      answer.scribe = last_attempt.scribe
    end
    answer.acting_as
  end
end
