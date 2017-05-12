# frozen_string_literal: true
class Course::Assessment::Question::Scribing < ActiveRecord::Base
  acts_as :question, class_name: Course::Assessment::Question.name
  has_one_attachment

  def to_partial_path
    'course/assessment/question/scribing/scribing'
  end
  
  def attempt(submission, last_attempt = nil)
    answer = submission.scribing_answers.build(submission: submission, question: question)
    if last_attempt
      answer.content = last_attempt.content
      if last_attempt.attachment_reference
        answer.attachment_reference = last_attempt.attachment_reference.dup
      end
    end
    answer.acting_as
  end

end
