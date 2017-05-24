# frozen_string_literal: true
class Course::Assessment::Question::Scribing::ScribingQuestionService
  # Creates a new PDF to image converter service object.
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
    # Use MiniMagick to identify the actual file type
    # instead of relying on file extension
    @mini_magick_file = MiniMagick::Image.new(@file.tempfile.path)

    # File is one of the accepted file types
    if (%w(JPEG GIF PJPEG PNG).include? @mini_magick_file.type)
      @question.save

    # File is a pdf file
    elsif (%w(PDF).include? @mini_magick_file.type)
      generate_pdf_questions

    # File is not a real image file
    else
      false
    end
  end

  def generate_pdf_questions # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    @question.class.transaction do # rubocop:disable Metrics/BlockLength
      filename = remove_whitespace(File.basename(@file.original_filename, '.pdf'))
      @mini_magick_file.pages.each_with_index do |_page, index|
        # Converts multipage pdf to single page pdf, then convert them with density
        temp_filename = "#{filename}[#{index + 1}].png"

        image = MiniMagick::Image.new(@file.tempfile.path + "[#{index}]")
        MiniMagick::Tool::Convert.new do |convert|
          convert.render
          convert.density(300)
          # need to check whether to resize image first or later
          convert.background('white')
          convert.flatten
          convert << image.path
          convert << temp_filename
        end

        new_question = Course::Assessment::Question::Scribing.new

        # Leave filename sanitization to attachment reference
        temp_upload_file = ActionDispatch::Http::UploadedFile.new(tempfile: File.new(temp_filename),
                                                                  filename: temp_filename.dup,
                                                                  type: 'image/png')
        new_question.file = temp_upload_file
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
      true
    end
  end

  # Convert spaces to underscore
  def remove_whitespace(filename)
    filename.tap do |name|
      name.tr! ' ', '_'
    end
  end
end
