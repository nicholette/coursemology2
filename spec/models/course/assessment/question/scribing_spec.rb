# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Course::Assessment::Question::Scribing, type: :model do

  it { is_expected.to act_as(Course::Assessment::Question) }

  it 'has one document file' do
    expect(subject).to have_one(:document_file).
      class_name(Course::Assessment::Question::ScribingDocumentFile.name).dependent(:destroy)
  end

end
