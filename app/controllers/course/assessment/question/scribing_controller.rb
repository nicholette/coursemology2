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
     if params[:question_scribing] && params[:question_scribing][:file] && params[:question_scribing][:file].content_type.downcase == 'application/pdf'

      #TODO: strip off file type, and sanitize file name
      #@basename = File.basename(sanitize_filename(uploaded_file_object.original_filename), '.pdf')
      filename = File.basename(params[:question_scribing][:file].original_filename, '.pdf')
      pdf_file = MiniMagick::Image.new(params[:question_scribing][:file].tempfile.path)
      file_upload_success = false

      pdf_file.pages.each_with_index { |page, index|
        # Converts multipage pdf to single page pdf, then convert them with density
        tempFileName = "#{filename}[#{index+1}].png"

        # Assume that all pdf's are A4 portrait 
        image = MiniMagick::Image.new(params[:question_scribing][:file].tempfile.path + "[#{index}]")
        MiniMagick::Tool::Convert.new do |convert|
          convert.render
          convert.density(300)
          # need to check whether to resize image first or later
          convert.resize('890x1256')
          convert.background('white')
          convert << image.path
          convert << tempFileName
        end
        
        # tempFileName = "#{filename}[#{index+1}].png"

        # page.write(tempFileName)
        # tempFile = MiniMagick::Image.new(tempFileName)

        # # Set white for transparent background
        # tempFile.background "white"
        # tempFile.flatten
        # tempFile.write(tempFileName)

        new_question = Course::Assessment::Question::Scribing.new

        # set params for the scribing question for this png file
        new_question.title = @scribing_question.title
        new_question.description = @scribing_question.description
        new_question.maximum_grade = @scribing_question.maximum_grade
        new_question.creator = current_user
        new_question.assessment = @assessment

        # Make sure new questions appear at the end of the list.
        max_weight = @assessment.questions.pluck(:weight).max
        new_question.weight ||= max_weight ? max_weight + 1 : 0

        fake_upload_file = ActionDispatch::Http::UploadedFile.new(:tempfile => File.new(tempFileName),
                                                                  :filename => tempFileName.dup,
                                                                  :type => 'image/png')

        new_question.file = fake_upload_file
        file_upload_success = new_question.save || file_upload_success

        #TODO: how to handle failure in one page?
      }

      respond_to do |format|
        if file_upload_success
          format.json { render_success_json t('.success') }
        else
          format.json { render_failure_json t('.failure') }
        end
      end

    elsif params[:file] && (allowed_img_types.include? params[:file][:content_type].downcase) || params.key?(:file) == false
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
    #TODO: dont allow editing of attachment first
    allowed_img_types = ['image/gif', 'image/png', 'image/jpeg', 'image/pjpeg']
    #special handling for PDF files
    if params[:question_scribing] && params[:question_scribing][:file] && params[:question_scribing][:file].content_type.downcase == 'application/pdf'
      #TODO: strip off file type, and sanitize file name
      #@basename = File.basename(sanitize_filename(uploaded_file_object.original_filename), '.pdf')
      filename = File.basename(params[:question_scribing][:file].original_filename, '.pdf')
      pdf_file = MiniMagick::Image.new(params[:question_scribing][:file].tempfile.path)
      pdf_file.pages.each_with_index { |page, index|
        tempFileName = "#{filename}#{index}.png"
        page.write(tempFileName)
        new_question = Course::Assessment::Question::Scribing.new

        # set params for the scribing question for this png file
        new_question.title = @scribing_question.title
        new_question.description = @scribing_question.description
        new_question.maximum_grade = @scribing_question.maximum_grade
        new_question.creator = current_user

        fake_upload_file = ActionDispatch::Http::UploadedFile.new(:tempfile => File.new(tempFileName),
                                                                  :filename => filename)
        new_question.file = fake_upload_file
        new_question.save

      }

    elsif params[:question_scribing] && params[:question_scribing][:file] && (allowed_img_types.include? params[:question_scribing][:file].content_type.downcase) || params.key?(:file) == false
      byebug
      respond_to do |format|
        if @scribing_question.update(scribing_question_params)
          format.json { render_scribing_question_json }
        else
          format.json { render_failure_json t('.failure') }
        end
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

  def render_success_json(message)
    render json: { message: message },
           status: :ok
  end

  def render_failure_json(message)
    render json: { message: message, errors: @scribing_question.errors.full_messages },
           status: :bad_request
  end
end
