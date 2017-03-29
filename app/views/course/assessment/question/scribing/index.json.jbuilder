json.(scribing_question, :id, :title, :description, :staff_only_comments, :maximum_grade, 
  :attempt_limit, skills_id: [])
json.canUpdate can?(:update, survey)

# json.isStarted current_user_response.present?
# json.responseId current_user_response && current_user_response.id
# json.submitted_at current_user_response && current_user_response.submitted_at
# json.canUpdate can?(:update, survey)
# json.canDelete can?(:destroy, survey)
# json.canCreateSection can?(:create, Course::Survey::Section.new(survey: survey))
# json.canViewResults can?(:manage, survey)


  # def scribing_question_params
  #   params.require(:scribing_question).permit(
  #     :title, :description, :staff_only_comments, :maximum_grade,
  #     :attempt_limit,
  #     skill_ids: []
  #   )
  # end