# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

RSpec.describe 'Health', type: :request do
  describe 'GET /health' do
    it 'responds with ok without authentication' do
      get '/health'

      expect(response).to have_http_status(:ok)
    end

    it 'returns the status as JSON' do
      get '/health'

      expect(response.parsed_body).to eq('status' => 'ok')
    end

    it 'does not query the database' do
      queries  = []
      callback = ->(*, payload) { queries << payload[:sql] if %w[SCHEMA TRANSACTION].exclude?(payload[:name]) }

      ActiveSupport::Notifications.subscribed(callback, 'sql.active_record') { get '/health' }

      expect(queries).to be_empty
    end
  end
end
