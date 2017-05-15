# frozen_string_literal: true
class Course::LessonPlan::ItemsController < Course::LessonPlan::Controller
  # This can only be done with Bullet once Rails supports polymorphic +inverse_of+.
  prepend_around_action :without_bullet, only: [:index]

  load_and_authorize_resource :item,
                              through: :course,
                              through_association: :lesson_plan_items,
                              class: Course::LessonPlan::Item.name,
                              parent: false

  def index
    respond_to do |format|
      format.html
      format.json { render_json_response }
    end
  end

  def update
    if @item.update_attributes(item_params)
      head :ok
    else
      head :bad_request
    end
  end

  private

  def item_params
    params.require(:item).permit(:start_at, :bonus_end_at, :end_at, :published)
  end

  def render_json_response
    @items = @items.order(start_at: :asc).includes(:actable).to_a.
             select { |item| can?(:show, item.actable) }

    @milestones = current_course.lesson_plan_milestones.order(start_at: :asc)

    @folder_loader = Course::Material::PreloadService.new(current_course)

    assessment_tabs_titles_hash
    render 'index'
  end

  # Returns a hash that maps tab ids to an array containing:
  # 1) The name of the assessment category it belongs to.
  # 2) The tab's title, if there is more than one tab in its cateogry.
  #
  # @return [Hash{Integer => Array<String>]
  def assessment_tabs_titles_hash
    @assessment_tabs_titles_hash ||=
      current_course.assessment_categories.includes(:tabs).map(&:tabs).flatten.
      map do |tab|
        [tab.id, tab_title_array(tab)]
      end.to_h
  end

  # Maps an assessment tab to an array of strings that describes its title. If the
  # tab is the only one in its category, it is sufficient to use its cateogry's name
  # as its title, otherwise, we use both the category and tab name to describe it.
  #
  # @param [Course::Assessment::Tab]
  # @return [Array<String>]
  def tab_title_array(tab)
    category_name = tab.category.title.singularize
    tab.category.tabs.size > 1 ? [category_name, tab.title] : [category_name]
  end
end
