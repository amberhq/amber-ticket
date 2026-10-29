# amber-ticket

Amber's helpdesk, a fork of [Zammad](https://zammad.org) 7.2. Agents work tickets in the Zammad UI. Customers
reach us by email and Slack. This file covers what is needed to run it; [README.md](README.md) is Zammad's own.

- **Owner team:** TBD
- **Type:** customer-facing (third-party webhooks, customer email)
- **Stack:** Ruby on Rails, Vue 3, CoffeeScript (adopted open-source product, see _Exceptions_ below)

## Process types

One image, built from [Dockerfile](Dockerfile) (needs the build arg `COMMIT_SHA`). The entrypoint
[bin/docker-entrypoint](bin/docker-entrypoint) takes the process type as its argument.

| Process | Command | Port | Replicas |
| --- | --- | --- | --- |
| Migration (one-off job per deploy) | `zammad-init` | - | 1, before the rollout |
| Web | `zammad-railsserver` | `3000` | 1 or more |
| Websocket | `zammad-websocket` | `6042` | 1 or more |
| Background worker and scheduler | `zammad-scheduler` | - | **exactly 1** |
| Reverse proxy (optional, if no ingress routing) | `zammad-nginx` | `8080` | 1 or more |

`zammad-init` creates or migrates the database, syncs translations and builds the search index. The other
processes wait until it has finished.

Ingress routes `/ws` to the websocket process, and `/cable` and everything else to web, with WebSocket upgrade
headers. Reference config: [contrib/nginx/zammad_ssl.conf](contrib/nginx/zammad_ssl.conf).

## Health endpoint

`GET /health` on the web process returns `200 {"status":"ok"}`. It needs no login and does not touch the database.

## Datastores

| Service | Purpose |
| --- | --- |
| PostgreSQL | All records, web sessions, background job queue |
| Redis | Websocket sessions, ActionCable / GraphQL subscriptions |
| Elasticsearch | Ticket search and reporting |
| Memcached | Shared cache and rate-limit counters (without it, each pod keeps its own file cache) |
| S3 bucket | Attachments |

## Environment variables

| Variable | Secret | Purpose |
| --- | --- | --- |
| `POSTGRESQL_HOST`, `POSTGRESQL_PORT`, `POSTGRESQL_DB`, `POSTGRESQL_USER` | no | Database connection |
| `POSTGRESQL_PASS` | yes | Database password (the image default `zammad` must be overridden) |
| `POSTGRESQL_OPTIONS` | no | Connection options, default `?pool=50` |
| `POSTGRESQL_DB_CREATE` | no | Let `zammad-init` create the database, default `true` |
| `REDIS_URL` or `REDIS_SENTINELS` | yes | Redis connection |
| `MEMCACHE_SERVERS` | no | Memcached connection |
| `ELASTICSEARCH_HOST`, `ELASTICSEARCH_PORT`, `ELASTICSEARCH_SCHEMA` | no | Search connection, applied by `zammad-init` |
| `ELASTICSEARCH_USER`, `ELASTICSEARCH_PASS` | yes | Search credentials, if needed |
| `ELASTICSEARCH_NAMESPACE`, `ELASTICSEARCH_REINDEX` | no | Index prefix, and whether `zammad-init` builds a missing index |
| `S3_URL` | yes | Attachment bucket, e.g. `https://s3.<region>.amazonaws.com/<bucket>?region=<region>` |
| `RAILS_LOG_TO_STDOUT` | no | Log to stdout, set to `true` in the image |
| `RAILS_LOG_FORMAT` | no | Set to `json` for one JSON object per log line |
| `RAILS_TRUSTED_PROXIES` | no | Proxies whose `X-Forwarded-For` is trusted |
| `ZAMMAD_RAILSSERVER_HOST`, `ZAMMAD_RAILSSERVER_PORT` | no | Where `zammad-nginx` finds web |
| `ZAMMAD_WEBSOCKET_HOST`, `ZAMMAD_WEBSOCKET_PORT` | no | Where `zammad-nginx` finds websocket |
| `NGINX_PORT`, `NGINX_SERVER_NAME`, `NGINX_CLIENT_MAX_BODY_SIZE` | no | `zammad-nginx` settings |
| `AUTOWIZARD_JSON` | yes | Base64 first-run setup (admin user, settings), used once by `zammad-init` |

Application settings such as the public hostname (`fqdn`), `http_type` and email channels live in the database
and are changed in the admin UI, not through environment variables.

## Logging

Logs go to stdout. With `RAILS_LOG_FORMAT=json` each line is a JSON object with `timestamp`, `level`, `pid`,
`message` and, on web requests, the request id in `tags`.

## Attachments in S3

1. Set `S3_URL` on every process.
2. In the admin UI, set _System > Storage_ to _Simple Storage (S3)_. Existing attachments move over in the
   background.

Zammad's S3 client uses the access key and secret given in `S3_URL`; DevOps provides them (exception to C16,
see below).

## Writable paths

The app runs as UID `1000`. Besides `/tmp` it writes to `/opt/zammad/tmp` (cache, pid files). For a read-only
root filesystem, mount an empty, non-persistent volume there. With attachments in S3 and logs on stdout,
`/opt/zammad/storage` and `/opt/zammad/log` are not used.

## AWS access

| Process | Resources | Actions |
| --- | --- | --- |
| Web, worker | Attachment bucket | `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, multipart upload actions |

## Running locally

See the [developer manual](doc/developer_manual/development_environment/getting-started.md).
In short: PostgreSQL and Redis running locally, `config/database.yml` from
[config/database/database.yml](config/database/database.yml), then `bundle install`, `pnpm install`,
`rails db:create db:migrate db:seed` and `bin/dev`.

## Exceptions to service standards

Agreed with DevOps, records pending in `sdlc-docs/service-exceptions/amber-ticket/`:

- T1, T2, T3, T5, T6 (tech stack): Ruby on Rails, Vue 3 and CoffeeScript. Requested, permanent.
- T8 (search): Elasticsearch instead of OpenSearch. Requested, permanent.
- T8 (cache): Memcached instead of Redis. Requested, permanent.
- C16 (AWS access): S3 access key in `S3_URL`. Requested, permanent.
- C16 (AWS access): SMTP credentials for outbound email. Requested, permanent.
- X11 (error tracking): none at launch. Requested, temporary.
