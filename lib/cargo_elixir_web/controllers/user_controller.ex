defmodule CargoElixirWeb.UserController do
  use CargoElixirWeb, :controller

  def create(conn, params) do
    conn |> send_resp(201, "")
  end
end
