json.question do
  json.(@scribing_question, :id, :title, :description, :staff_only_comments, :maximum_grade,
    :weight)
  json.skill_ids @scribing_question.skills.order('LOWER(title) ASC').as_json(only: [:id, :title])
  json.skills current_course.assessment_skills.order('LOWER(title) ASC') do |skill|
    json.(skill, :id, :title)
  end

  json.published_assessment @assessment.published?
  json.attempt_limit @scribing_question.attempt_limit

  # check what are packages for, and how it relates to attachments
  # if @scribing_question.attachment.present? && @scribing_question.attachment.persisted?
  #   json.package do
  #     json.name @scribing_question.attachment.name
  #     json.path attachment_reference_path(@scribing_question.attachment)
  #     json.updater_name @scribing_question.attachment.updater.name
  #   end
  # else
  #   json.package nil
  # end
end
