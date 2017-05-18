# frozen_string_literal: true
class Course::Assessment::Question::ScribingController < \
  Course::Assessment::QuestionsController
  load_and_authorize_resource :scribing_question,
                              class: Course::Assessment::Question::Scribing,
                              through: :assessment, parent: false

  include CarrierWave::MiniMagick

  def new
    respond_to do |format|
      format.html { render 'new' }
    end
  end

  def show
    respond_to do |format|
      format.json { render_scribing_question_json }
    end
  end

  def create
    allowed_img_types = ['image/gif', 'image/png', 'image/jpeg', 'image/pjpeg']

    #special handling for PDF files
    if params[:question_scribing] && params[:question_scribing][:file]&.content_type&.downcase == 'application/pdf'
      file = params[:question_scribing][:file]
      respond_to do |format|
        if (generatePdfQuestions file)
          format.json { render_success_json t('.success') }
        else
          format.json { render_failure_json t('.failure') }
        end
      end
    else
      respond_to do |format|
        if @scribing_question.save
          format.json { render_scribing_question_json }
        else
          format.json { render_failure_json t('.failure') }
        end
      end
    end
  end

  def edit
    respond_to do |format|
      format.html { render 'edit' }
      format.json { render_scribing_question_json }
    end
  end

  def update
    # Don't allow the user to edit attachment at the moment
    # In case the user uploads a multipage pdf to replace
    respond_to do |format|
      if @scribing_question.update(scribing_question_update_params)
        format.json { render_scribing_question_json }
      else
        format.json { render_failure_json t('.failure') }
      end
    end
  end

  def destroy
    if @scribing_question.destroy
      redirect_to course_assessment_path(current_course, @assessment),
                  success: t('.success')
    else
      error = @scribing_question.errors.full_messages.to_sentence
      redirect_to course_assessment_path(current_course, @assessment),
                  danger: t('.failure', error: error)
    end
  end

  private

  def render_scribing_question_json
    render partial: 'scribing_question', locals: { scribing_question: @scribing_question }
  end

  def scribing_question_params
    params.require(:question_scribing).permit(
      :title, :description, :staff_only_comments, :maximum_grade,
      attachment_params, skill_ids: []
    )
  end

  # Don't allow uploading of files at the moment
  def scribing_question_update_params
    params.require(:question_scribing).permit(
      :title, :description, :staff_only_comments, :maximum_grade,
      skill_ids: []
    )
  end 

  def render_success_json(message)
    render json: { message: message },
           status: :ok
  end

  def render_failure_json(message)
    render json: { message: message, errors: @scribing_question.errors.full_messages },
           status: :bad_request
  end

  def generatePdfQuestions(file)
    result = @scribing_question.class.transaction do
      filename = remove_whitespace(File.basename(file.original_filename, '.pdf'))
      pdf_file = MiniMagick::Image.new(file.tempfile.path)

      pdf_file.pages.each_with_index { |page, index|
        # Converts multipage pdf to single page pdf, then convert them with density
        tempFileName = "#{filename}[#{index+1}].png"

        # Assume that all pdf's are A4 portrait 
        image = MiniMagick::Image.new(file.tempfile.path + "[#{index}]")
        MiniMagick::Tool::Convert.new do |convert|
          convert.render
          convert.density(300)
          # need to check whether to resize image first or later
          convert.background('white')
          convert.flatten
          convert << image.path
          convert << tempFileName
        end

        new_question = Course::Assessment::Question::Scribing.new

        # Leave filename sanitization to attachment reference
        fake_upload_file = ActionDispatch::Http::UploadedFile.new(:tempfile => File.new(tempFileName),
                                                                  :filename => tempFileName.dup,
                                                                  :type => 'image/png')
        new_question.file = fake_upload_file
        new_question.title = @scribing_question.title
        new_question.description = @scribing_question.description
        new_question.maximum_grade = @scribing_question.maximum_grade
        new_question.creator = current_user
        new_question.assessment = @assessment

        # Make sure new questions appear at the end of the list.
        max_weight = @assessment.questions.pluck(:weight).max
        new_question.weight ||= max_weight ? max_weight + 1 : 0

        raise ActiveRecord::Rollback unless new_question.save
      }
      true
    end
  end

  # Convert spaces to underscore
  def remove_whitespace(filename)
    filename.tap do |name|
      name.gsub! ' ', '_'
    end
  end
end
