defmodule CargoElixirWeb.PageController do
  use CargoElixirWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def get_console_stats(conn, _params) do
    case HTTPoison.get("https://console.helium.com/api/stats", ["Authorization": Application.fetch_env!(:cargo_elixir, :console_stats_secret)]) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        conn |> json(Jason.decode!(body))
    end
  end
end
