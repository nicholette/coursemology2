# These are the common fields to be displayed for all lesson plan items
json.id                         item.acting_as.id
json.lesson_plan_element_class  item.class.name
json.(item, :title, :published, :start_at, :bonus_end_at, :end_at)
