defmodule CargoElixirWeb.PayloadChannel do
  use Phoenix.Channel

  def join("payload:new", _msg, socket) do
    {:ok, socket}
  end
end

# CargoElixirWeb.Endpoint.broadcast! "payload:new", "new_payload", %{data: 1}
