class CreateCourseAssessmentAnswerScribingScribbles < ActiveRecord::Migration
  def change
    create_table :course_assessment_answer_scribing_scribbles do |t|
      t.text :content
      t.references :scribing_answer,
                   index: {
                     name: :fk__course_assessment_answer_scribing_scribbles_scribing_answer
                   },
                   foreign_key: {
                     references: :course_assessment_answer_scribings
                   }
    end
  end
end