defmodule CargoElixirWeb.PayloadController do
  use CargoElixirWeb, :controller

  alias CargoElixir.Payloads
  alias CargoElixir.Payloads.Payload

  def create(conn, params) do
    with {:ok, %Payload{}} <- Payloads.create_payload(params) do
      conn |> send_resp(201, "")
    end
  end

  def get_devices(conn, %{"oui" => oui}) do
    devices = Payloads.get_devices(oui)
    conn |> json(devices)
  end
end
