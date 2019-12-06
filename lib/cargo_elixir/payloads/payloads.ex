defmodule CargoElixir.Payloads do
  import Ecto.Query, warn: false
  alias CargoElixir.Repo

  alias CargoElixir.Payloads.Payload

  def create_payload(%{ "device_id" => device_id, "gateway" => hotspot_id, "oui" => oui, "payload" => payload, "rssi" => rssi, "sequence" => seq_num, "timestamp" => reported}) do
    binary = payload |> :base64.decode()
    binary_length = byte_size(binary)

    <<lat :: integer-signed-32>> = binary_part(binary, 0, 4)
    <<lon :: integer-signed-32>> = binary_part(binary, 4, 4)
    <<elevation :: integer-signed-16>> = binary_part(binary, 8, 2)
    <<speed :: integer-signed-16>> = binary_part(binary, 10, 2)
    battery = 0
    if binary_length > 12 do
      <<battery :: integer-unsigned-16>> = binary_part(binary, 12, 2)
    end

    attrs = %{}
      |> Map.put(:device_id, device_id)
      |> Map.put(:hotspot_id, hotspot_id)
      |> Map.put(:oui, oui)
      |> Map.put(:lat, lat / 10000000)
      |> Map.put(:lon, lon / 10000000)
      |> Map.put(:speed, speed)
      |> Map.put(:rssi, rssi)
      |> Map.put(:elevation, elevation)
      |> Map.put(:battery, battery)
      |> Map.put(:seq_num, seq_num)
      |> Map.put(:reported, reported |> DateTime.from_unix!())

    %Payload{}
    |> Payload.changeset(attrs)
    |> Repo.insert()
  end

  def get_devices(oui) do
    query = from p in Payload,
      where: p.oui == ^oui,
      group_by: [p.device_id, p.oui],
      select: %{ device_id: p.device_id, created_at: max(p.created_at), hotspot: min(p.hotspot_id) },
      order_by: [desc: max(p.created_at)]
    Repo.all(query)
  end

  def get_payloads(device_id, last_packet_time) do
    {:ok, datetime, 0} = DateTime.from_iso8601(last_packet_time)
    packets_start_time = DateTime.from_unix!(DateTime.to_unix(datetime) - 10800)

    query = from p in Payload,
      where: (p.device_id == ^device_id and p.created_at > ^packets_start_time),
      order_by: [asc: p.created_at],
      select: p
    Repo.all(query)
  end
end
