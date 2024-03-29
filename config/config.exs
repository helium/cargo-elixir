# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :cargo_elixir,
  ecto_repos: [CargoElixir.Repo]

# Configures the endpoint
config :cargo_elixir, CargoElixirWeb.Endpoint,
  url: [host: "localhost"], # UPDATE TO YOUR CUSTOM HOST IF NOT RUNNING LOCALLY
  secret_key_base: "pnPHQ4sSmnHnN1DGsMoFaMALbUxIazKvmaKzYlCm5JUl2JmapF1hSnFlwKlFjZYQ",
  render_errors: [view: CargoElixirWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: CargoElixir.PubSub

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
