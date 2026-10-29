# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

# Log one JSON object per line instead of plain text, e.g. for log collectors in container deployments.
if ENV['RAILS_LOG_FORMAT'] == 'json'
  require 'zammad/logging/json_formatter'

  formatter = Zammad::Logging::JsonFormatter.new
  formatter.extend(ActiveSupport::TaggedLogging::Formatter)

  Rails.logger.formatter = formatter
end
