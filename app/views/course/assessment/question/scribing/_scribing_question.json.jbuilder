json.question do
  json.(@scribing_question, :id, :title, :description, :staff_only_comments, :maximum_grade,
    :weight)
  
  if @scribing_question.attachment_references.present?
    json.attachment_reference do
      json.name @scribing_question.attachment_references[0].name
      json.path attachment_reference_path(@scribing_question.attachment_references[0])
      json.updater_name @scribing_question.attachment_references[0].updater.name
    end
  else
    json.attachment_reference nil
  end

  json.skill_ids @scribing_question.skills.order('LOWER(title) ASC').as_json(only: [:id, :title])
  json.skills current_course.assessment_skills.order('LOWER(title) ASC') do |skill|
    json.(skill, :id, :title)
  end

  json.published_assessment @assessment.published?
end
