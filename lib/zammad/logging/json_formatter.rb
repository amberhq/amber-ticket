# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

module Zammad
  module Logging
    # Writes each log entry as a single line of JSON, for log collectors in container deployments.
    #   Log tags (like the request id) are moved out of the message into their own field.
    class JsonFormatter < ::Logger::Formatter
      def call(severity, time, progname, msg)
        tags    = respond_to?(:current_tags) ? current_tags : []
        message = msg2str(msg).to_s.scrub

        # ActiveSupport::TaggedLogging prepends the tags to the message before it reaches this formatter.
        message = message.delete_prefix("[#{tags.join('] [')}] ") if tags.any?

        entry = {
          timestamp: time.utc.iso8601(6),
          level:     severity,
          pid:       Process.pid,
          message:   message,
        }
        entry[:progname] = progname if progname.present?
        entry[:tags]     = tags.dup if tags.any?

        "#{entry.to_json}\n"
      end
    end
  end
end
