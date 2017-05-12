class CreateCourseAssessmentAnswerScribingScribbles < ActiveRecord::Migration
  def change
    create_table :course_assessment_answer_scribing_scribbles do |t|
      t.text :content, null: false, limit: 16777215
      t.references :user, null: false
      t.references :answer,
                   index: {
                     name: :fk__course_assessment_answer_scribing_scribbles_scribing_answer
                   },
                   foreign_key: {
                     references: :course_assessment_answer_scribings
                   }

      t.timestamps null: false
    end

    # remove_column :course_assessment_question_scribings, :attempt_limit
    # remove_column :course_assessment_question_scribings, :created_at
    # remove_column :course_assessment_question_scribings, :updated_at
    add_column :course_assessment_answer_scribings, :content, :text, { limit: 16777215, null: false }
  end
end