defmodule CargoElixir.Payloads do
  import Ecto.Query, warn: false
  alias CargoElixir.Repo

  alias CargoElixir.Payloads.Payload

  def create_payload(%{ "device_id" => device_id, "gateway" => hotspot_id, "oui" => oui, "payload" => payload, "rssi" => rssi, "sequence" => seq_num, "timestamp" => reported}) do
    binary = payload |> :base64.decode()
    <<lat :: integer-signed-32>> = binary_part(binary, 0, 4)
    <<lon :: integer-signed-32>> = binary_part(binary, 4, 4)
    <<elevation :: integer-signed-16>> = binary_part(binary, 8, 2)
    <<speed :: integer-signed-16>> = binary_part(binary, 10, 2)
    <<battery :: integer-unsigned-16>> = binary_part(binary, 12, 2)

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
      select: %{ device_id: p.device_id, created_at: max(p.created_at)}
    Repo.all(query)
  end
end
