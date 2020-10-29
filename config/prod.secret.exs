# In this file, we load production configuration and
# secrets from environment variables. You can also
# hardcode secrets, although such is generally not
# recommended and you have to remember to add this
# file to your .gitignore.
use Mix.Config

database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

config :cargo_elixir, CargoElixir.Repo,
  ssl: true,
  url: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """
config :cargo_elixir, CargoElixirWeb.Endpoint,
  url: [scheme: "https", host: "cargo.helium.com", port: 443],
  http: [:inet6, port: String.to_integer(System.get_env("PORT") || "4000")],
  check_origin: false,
  # check_origin: [
  #   "https://cargo-elixir.herokuapp.com",
  #   "https://cargo.helium.com",
  # ],
  force_ssl: [rewrite_on: [:x_forwarded_proto]],
  cache_static_manifest: "priv/static/cache_manifest.json",
  secret_key_base: secret_key_base
  

config :cargo_elixir, console_stats_secret: System.get_env("CONSOLE_STATS_SECRET")
