json.form_data do
  json.method 'POST'
  json.auth_token form_authenticity_token
  json.path course_assessment_question_scribing_index_path(current_course, @assessment)
end

json.partial! 'props'
