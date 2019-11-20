defmodule CargoElixirWeb.PageController do
  use CargoElixirWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
