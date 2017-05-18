# frozen_string_literal: true
FactoryGirl.define do
  factory :course_assessment_question_scribings,
          class: Course::Assessment::Question::Scribing,
          parent: :course_assessment_question do

    attachment_reference do
      file = File.new(File.join(Rails.root, 'spec/fixtures/files/'\
                        'document.pdf'), 'rb')
      AttachmentReference.new(file: file)
    end
  end
end
