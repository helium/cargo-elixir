defmodule CargoElixir.Users do
  import Ecto.Query, warn: false
  alias CargoElixir.Repo

  alias CargoElixir.Users.User

  def create_user(user_params) do
    %User{}
    |> User.changeset(user_params)
    |> Repo.insert()
  end
end
