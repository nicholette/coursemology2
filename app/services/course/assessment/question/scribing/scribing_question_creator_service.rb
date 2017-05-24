# frozen_string_literal: true
class Course::Assessment::Question::Scribing::ScribingQuestionCreatorService
  # Creates a new scribing question creator service object.
  #
  # @param [Course::Assessment::Question::Scribing] question The scribing question with the
  #   pdf attachment.
  # @param [PDF file in temporary directory] file The PDF attachment
  def initialize(question, file, user, assessment)
    @question = question
    @file = file
    @user = user
    @assessment = assessment
  end

  def save_question
    scribing_image_service(@file).authorized_file_type? && saving_successful?
  end

  private

  def saving_successful?
    image_files = scribing_image_service(@file).generateImages

    @question.class.transaction do 
      image_files.each do |file|
        new_question = Course::Assessment::Question::Scribing.new
        new_question.file = file
        new_question.title = @question.title
        new_question.description = @question.description
        new_question.maximum_grade = @question.maximum_grade
        new_question.creator = @user
        new_question.assessment = @assessment

        # Make sure new questions appear at the end of the list.
        max_weight = @assessment.questions.pluck(:weight).max
        new_question.weight ||= max_weight ? max_weight + 1 : 0

        raise ActiveRecord::Rollback unless new_question.save
      end
    end
    true
  end

  def scribing_image_service(file)
    @service ||= Course::Assessment::Question::Scribing::ScribingImageService.new file
  end
end
