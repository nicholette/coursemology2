FactoryGirl.define do
  factory :course_assessment_question_scribings,
          class: Course::Assessment::Question::Scribing,
          parent: :course_assessment_question do

  end
end
