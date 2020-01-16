defmodule CargoElixirWeb.PayloadController do
  use CargoElixirWeb, :controller

  alias CargoElixir.Payloads
  alias CargoElixir.Payloads.Payload

  def create(conn, params) do
    with {:ok, %Payload{} = payload} <- Payloads.create_payload(params) do
      CargoElixirWeb.Endpoint.broadcast!("payload:new", "new_payload", payload)

      conn |> send_resp(201, "")
    end
  end

  def get_devices(conn, %{"oui" => oui, "device_id" => device_id}) do
    device = Payloads.get_device(oui, device_id)
    conn |> json(device)
  end

  def get_devices(conn, %{"oui" => oui}) do
    devices = Payloads.get_devices(oui)
    conn |> json(devices)
  end

  def get_payloads(conn, %{"id" => device_id, "last_at" => last_packet_time }) do
    payloads = Payloads.get_payloads(device_id, last_packet_time)
    conn |> json(payloads)
  end

  def get_stats(conn, %{ "time" => time }) do
    currently_transmitting = Payloads.get_currently_transmitting() |> List.first()
    devices_transmitted = Payloads.get_device_stats(time) |> List.first()
    hotspots_transmitted = Payloads.get_hotspot_stats(time) |> List.first()
    payloads_transmitted = Payloads.get_payload_stats(time) |> List.first()
    conn
      |> json(%{
        currentlyTransmitting: currently_transmitting,
        devicesTransmitted: devices_transmitted,
        hotspotsTransmitted: hotspots_transmitted,
        payloadsTransmitted: payloads_transmitted,
      })
  end
end
