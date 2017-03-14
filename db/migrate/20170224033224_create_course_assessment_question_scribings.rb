class CreateCourseAssessmentQuestionScribings < ActiveRecord::Migration
  def change
    create_table :course_assessment_question_scribings do |t|
      t.timestamps null: false
      t.integer :attempt_limit
    end

    create_table :course_assessment_question_scribing_document_files do |t|
      t.references :question, foreign_key: { references: :course_assessment_question_scribings },
                   null: false
      t.string :filename, null: false
      t.text :content, null: false
    end

  end
end
