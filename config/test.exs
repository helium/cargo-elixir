use Mix.Config

# Configure your database
config :cargo_elixir, CargoElixir.Repo,
  username: "postgres",
  password: "postgres",
  database: "cargo_elixir_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :cargo_elixir, CargoElixirWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn
