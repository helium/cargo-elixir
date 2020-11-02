import Config
db_host = System.get_env("DATABASE_HOST") ||
  raise """
  environment variable DATABASE_HOST is missing.
  """
db_database = System.get_env("DATABASE_DB") || "cargo_elixir_dev"
db_username = System.get_env("DATABASE_USER") || "postgres"
db_password = System.get_env("DATABASE_PASSWORD") || "postgres"
db_url = "ecto://#{db_username}:#{db_password}@#{db_host}/#{db_database}"
config :cargo_elixir, CargoElixir.Repo,
  url:  db_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")
secret_key_base = System.get_env("SECRET_KEY_BASE") ||
  raise """
  environment variable SECRET_KEY_BASE is missing.
  You can generate one by calling: mix phx.gen.secret
  """
config :cargo_elixir, CargoElixirWeb.Endpoint,
  http: [:inet6, port: 4000],
  check_origin: false,
  secret_key_base: secret_key_base
