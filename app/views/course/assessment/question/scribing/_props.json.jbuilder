json.partial! 'question'
# json.partial! 'import_result'

if @response
  json.partial! 'response', locals: { response: @response }
end
