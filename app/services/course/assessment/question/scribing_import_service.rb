# frozen_string_literal: true
# Imports new pdf files, splits and processes the files and creates scribing questions for each
# page of the PDF file.
class Course::Assessment::Question::ScribingImportService
  # Creates a new service import object.
  #
  # @param [Course::Assessment::Question::Scribing] question The scribing question for import.
  def initialize(question, file)
    @question = question
    @file = file
  end

  # Imports and saves the provided PDF as a scribing question.
  #
  # @return [Boolean] True if the pdf is processed and successfully saved, otherwise false. Note
  #   that if the save is unsuccessful, all questions are not persisted.
  def save
    return_value = true
    Course::Assessment::Question::Scribing.transaction do
      generate_pdf_files.each do |file|
        question = build_scribing_question
        question.file = file
        unless question.save
          return_value = false
          raise ActiveRecord::Rollback
        end
      end
    end
    return_value
  end

  private

  # Generated an array of PDF files based on the original +@question.file+. This file is split up
  # into smaller files based on the number of pages.
  #
  # @return [Array<ActionDispatch::Http::UploadedFile>] Array of processed files.
  def generate_pdf_files
    filename = File.basename(@file.original_filename, '.pdf').tr(' ', '_')

    MiniMagick::Image.new(@file.tempfile.path).pages.each_with_index.map do |page, index|
      temp_name = "#{filename}[#{index + 1}].png"
      process_pdf(page.path, temp_name)

      # Leave filename sanitization to attachment reference
      ActionDispatch::Http::UploadedFile.
        new(tempfile: File.new(temp_name), filename: temp_name.dup, type: 'image/png')
    end
  end

  # Process the PDF given the image path, with the new_name as the new file name.
  #
  # @param [String] image_path
  # @param [String] new_name File name of newly processed file
  def process_pdf(image_path, new_name)
    MiniMagick::Tool::Convert.new do |convert|
      convert.render
      convert.density(300)
      # TODO: Check to resize image first or later
      convert.background('white')
      convert.flatten
      convert << image_path
      convert << new_name
    end
  end

  # Builds a new scribing question given the +@question+ instance varible.
  #
  # @return [Course::Assessment::Question::Scribing] New scribing that is not persisted.
  def build_scribing_question
    Course::Assessment::Question::Scribing.new(
      title: @question.title,
      description: @question.description,
      maximum_grade: @question.maximum_grade,
      assessment: @question.assessment,
      weight: (max_weight ? max_weight + 1 : 0)
    )
  end

  # Returns the maximum weight of the questions for the current assessment.
  #
  # @return [Fixnum] Maximum weight of the questions for the current assessment.
  def max_weight
    @max_weight ||= @question.assessment.questions.pluck(:weight).max
  end
end
