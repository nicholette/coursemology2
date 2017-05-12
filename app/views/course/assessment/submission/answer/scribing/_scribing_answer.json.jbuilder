json.scribing_answer do
  json.scribbles @scribing_answer.scribbles.as_json(only: [:user_id, :content])
end
