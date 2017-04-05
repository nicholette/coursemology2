# frozen_string_literal: true
class Course::Assessment::Question::Scribing < ActiveRecord::Base
  acts_as :question, class_name: Course::Assessment::Question.name
  has_one_attachment

  has_one :attachment_reference, class_name: AttachmentReferencesController.name,
          dependent: :destroy, foreign_key: :question_id, inverse_of: :question
  accepts_nested_attributes_for :attachment_reference, allow_destroy: true


  def to_partial_path
    'course/assessment/question/scribing/scribing'
  end

  def attempt(submission, _last_attempt = nil)
    answer = submission.scribing_answers.build(submission: submission, question: question)
    answer.acting_as
  end
end
