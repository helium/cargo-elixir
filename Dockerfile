FROM elixir:1.9-alpine

# install build dependencies
RUN apk add --update git build-base nodejs npm yarn python bash openssl postgresql-client

RUN mkdir /app
WORKDIR /app

# install Hex + Rebar
RUN mix do local.hex --force, local.rebar --force

# set build ENV
ENV MIX_ENV=prod

# install mix dependencies
COPY mix.lock mix.lock
COPY mix.exs  mix.exs
COPY config config
RUN mix deps.get --only $MIX_ENV
RUN mix deps.compile

# build assets
COPY assets assets
RUN cd assets && yarn && yarn run deploy
RUN mix phx.digest

# build project
COPY priv priv
COPY lib lib
RUN mix compile

# build release
# at this point we should copy the rel directory but
# we are not using it so we can omit it
# COPY rel rel
RUN mix release

EXPOSE 4000
COPY entrypoint.sh .
RUN chown -R nobody: /app
USER nobody

CMD ["bash", "/app/entrypoint.sh"]
