defmodule CargoElixirWeb.UserController do
  use CargoElixirWeb, :controller

  alias CargoElixir.Users
  alias CargoElixir.Users.User

  def create(conn, params) do
    with {:ok, %User{}} <- Users.create_user(params) do
      conn |> send_resp(201, "")
    end
  end
end
