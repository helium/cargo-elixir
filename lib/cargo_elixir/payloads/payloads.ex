defmodule CargoElixir.Payloads do
  import Ecto.Query, warn: false
  alias CargoElixir.Repo

  alias CargoElixir.Payloads.Payload

  def create_payload(packet = %{ "device_id" => device_id, "gateway" => hotspot_id, "oui" => oui, "payload" => payload, "rssi" => rssi, "sequence" => seq_num, "timestamp" => reported}) do
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
      |> Map.put(:snr, Map.get(packet, "snr", 0))
    %Payload{}
    |> Payload.changeset(attrs)
    |> Repo.insert()
  end

  def create_payload(packet = %{ "device_id" => device_id, "gateway" => hotspot_id, "oui" => oui, "lat" => lat, "lon" => lon, "speed" => speed, "elevation" => elevation,
                     "battery" => battery, "rssi" => rssi, "sequence" => seq_num, "timestamp" => reported}) do

    attrs = %{}
      |> Map.put(:device_id, device_id)
      |> Map.put(:hotspot_id, hotspot_id)
      |> Map.put(:oui, oui)
      |> Map.put(:lat, lat)
      |> Map.put(:lon, lon)
      |> Map.put(:speed, speed)
      |> Map.put(:rssi, rssi)
      |> Map.put(:elevation, elevation)
      |> Map.put(:battery, battery)
      |> Map.put(:seq_num, seq_num)
      |> Map.put(:reported, reported |> DateTime.from_unix!())
      |> Map.put(:snr, Map.get(packet, "snr", 0))
    %Payload{}
    |> Payload.changeset(attrs)
    |> Repo.insert()
  end

  def get_devices(oui) do
    current_unix = DateTime.utc_now() |> DateTime.truncate(:second) |> DateTime.to_unix()
    date_threshold = DateTime.from_unix!(current_unix - 259200)

    query = from p in Payload,
      where: p.oui == ^oui and p.created_at > ^date_threshold,
      group_by: [p.device_id, p.oui],
      select: %{ device_id: p.device_id, created_at: max(p.created_at), hotspot: min(p.hotspot_id) },
      order_by: [desc: max(p.created_at)]
    Repo.all(query)
  end

  def get_device(oui, device_id) do
    query = from p in Payload,
      where: p.oui == ^oui and p.device_id == ^device_id,
      select: %{ device_id: p.device_id, created_at: p.created_at, hotspot: p.hotspot_id },
      order_by: [desc: p.created_at],
      limit: 1
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

  def get_currently_transmitting() do
    current_unix = DateTime.utc_now() |> DateTime.truncate(:second) |> DateTime.to_unix()
    date_threshold = DateTime.from_unix!(current_unix - 120)

    query = from p in Payload,
      where: p.created_at > ^date_threshold,
      select: count(p.device_id, :distinct)
    Repo.all(query)
  end

  def get_device_stats(time) do
    current_unix = DateTime.utc_now() |> DateTime.truncate(:second) |> DateTime.to_unix()
    query =
      case time do
        "24h" ->
          "SELECT count(distinct device_id) FROM payloads WHERE created_at > NOW() - interval '24 hour'"
        "7d" ->
          "SELECT count(*) FROM (SELECT * FROM distinct_devices_last_7 UNION SELECT distinct device_id FROM payloads WHERE created_at > CURRENT_DATE) AS count;"
        "30d" ->
          "SELECT count(*) FROM (SELECT * FROM distinct_devices_last_30 UNION SELECT distinct device_id FROM payloads WHERE created_at > CURRENT_DATE) AS count;"
        "all" ->
          "SELECT count(*) FROM (SELECT * FROM distinct_devices_all_time UNION SELECT distinct device_id FROM payloads WHERE created_at > CURRENT_DATE) AS count;"
      end
    run_query(query)
  end

  def get_hotspot_stats(time) do
    current_unix = DateTime.utc_now() |> DateTime.truncate(:second) |> DateTime.to_unix()
    query =
      case time do
        "24h" ->
          "SELECT count(distinct hotspot_id) FROM payloads WHERE created_at > NOW() - interval '24 hour'"
        "7d" ->
          "SELECT count(*) FROM (SELECT * FROM distinct_hotspots_last_7 UNION SELECT distinct hotspot_id FROM payloads WHERE created_at > CURRENT_DATE) AS count;"
        "30d" ->
          "SELECT count(*) FROM (SELECT * FROM distinct_hotspots_last_30 UNION SELECT distinct hotspot_id FROM payloads WHERE created_at > CURRENT_DATE) AS count;"
        "all" ->
          "SELECT count(*) FROM (SELECT * FROM distinct_hotspots_all_time UNION SELECT distinct hotspot_id FROM payloads WHERE created_at > CURRENT_DATE) AS count;"
      end
    run_query(query)
  end

  def get_payload_stats(time) do
    current_unix = DateTime.utc_now() |> DateTime.truncate(:second) |> DateTime.to_unix()
    query =
      case time do
        "24h" ->
          "SELECT count(*) FROM payloads WHERE created_at > NOW() - interval '24 hour'"
        "7d" ->
          "SELECT SUM(count) FROM (SELECT * FROM total_payloads_last_7 UNION SELECT count(*) FROM payloads WHERE created_at > CURRENT_DATE) AS sum;"
        "30d" ->
          "SELECT SUM(count) FROM (SELECT * FROM total_payloads_last_30 UNION SELECT count(*) FROM payloads WHERE created_at > CURRENT_DATE) AS sum;"
        "all" ->
          "SELECT SUM(count) FROM (SELECT * FROM total_payloads_all_time UNION SELECT count(*) FROM payloads WHERE created_at > CURRENT_DATE) AS sum;"
      end
    run_query(query)
  end

  defp run_query(query) do
    result = Ecto.Adapters.SQL.query!(Repo, query)
    result.rows |> List.first()
  end
end
