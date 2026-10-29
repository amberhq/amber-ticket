# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

Zammad::Application.routes.draw do

  # Liveness probe for container platforms: cheap, unauthenticated and without database access,
  #   so a short outage of a dependency does not restart every instance at once.
  match '/health', to: proc { [200, { 'content-type' => 'application/json' }, ['{"status":"ok"}']] }, via: :get

end
