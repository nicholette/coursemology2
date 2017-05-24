# frozen_string_literal: true
class Course::Assessment::Question::Scribing::ScribingImageService
  # Creates a new image service object.
  #
  # @param [file] file The file attachment
  def initialize(file)
    @file = file
  end

  def authorized_file_type?
    # Use MiniMagick to identify the actual file type
    # instead of relying on file extension
    @mini_magick_file = MiniMagick::Image.new(@file.tempfile.path)
    %w(JPEG GIF PJPEG PNG PDF).include? @mini_magick_file.type
  end

  def generateImages
    image_files = Array.new

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

      temp_file = ActionDispatch::Http::UploadedFile.new(tempfile: File.new(temp_filename),
                                                         filename: temp_filename.dup,
                                                         type: 'image/png')
      image_files << temp_file
    end
    image_files
  end

  private

  # Convert spaces to underscore
  def remove_whitespace(filename)
    filename.tap do |name|
      name.tr! ' ', '_'
    end
  end
end
