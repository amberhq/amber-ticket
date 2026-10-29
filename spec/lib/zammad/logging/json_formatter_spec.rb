# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe Zammad::Logging::JsonFormatter do
  let(:output) { StringIO.new }
  let(:logger) do
    logger = ActiveSupport::Logger.new(output)
    logger.formatter = described_class.new
    ActiveSupport::TaggedLogging.new(logger)
  end
  let(:entry) { JSON.parse(output.string) }

  it 'writes one JSON object per line' do
    logger.info('first')
    logger.info('second')

    expect(output.string.lines.map { |line| JSON.parse(line)['message'] }).to eq(%w[first second])
  end

  it 'includes timestamp, level, pid and message' do
    logger.warn('something happened')

    expect(entry).to include(
      'timestamp' => match(%r{\A\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z\z}),
      'level'     => 'WARN',
      'pid'       => Process.pid,
      'message'   => 'something happened',
    )
  end

  it 'moves log tags out of the message' do
    logger.tagged('3f1c2a9e-request-id', 'other') { logger.info('tagged message') }

    expect(entry).to include('message' => 'tagged message', 'tags' => %w[3f1c2a9e-request-id other])
  end

  it 'omits tags when there are none' do
    logger.info('untagged message')

    expect(entry).not_to have_key('tags')
  end

  it 'writes exceptions as text' do
    logger.error(StandardError.new('broken'))

    expect(entry['message']).to start_with('broken (StandardError)')
  end
end
