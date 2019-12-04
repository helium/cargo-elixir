defmodule CargoElixirWeb.PayloadChannel do
  use Phoenix.Channel

  def join("payload:new", _msg, socket) do
    {:ok, socket}
  end

  def handle_in("new_payload", msg, socket) do
    push socket, "new_payload", msg
    {:noreply, socket}
  end
end

# CargoElixirWeb.Endpoint.broadcast! "payload:new", "new_payload", %{data: 1}
