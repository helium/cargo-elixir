defmodule CargoElixir.Repo do
  use Ecto.Repo,
    otp_app: :cargo_elixir,
    adapter: Ecto.Adapters.Postgres
end
