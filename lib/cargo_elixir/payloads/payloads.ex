defmodule CargoElixir.Payloads do
  import Ecto.Query, warn: false
  alias CargoElixir.Repo

  alias CargoElixir.Payloads.Payload

  def create_payload(packet = %{ "device_id" => device_id, "gateway" => hotspot_id, "oui" => oui, "payload" => payload, "rssi" => rssi, "sequence" => seq_num, "timestamp" => reported}) do
    binary = payload |> :base64.decode()

    attrs = %{}
      |> Map.put(:device_id, device_id)
      |> Map.put(:hotspot_id, hotspot_id)
      |> Map.put(:oui, oui)
      |> Map.put(:rssi, rssi)
      |> Map.put(:seq_num, seq_num)
      |> Map.put(:reported, reported |> DateTime.from_unix!())
      |> Map.put(:snr, Map.get(packet, "snr", 0))

    attrs = case binary do
       <<0x01, 0x88, lat :: integer-signed-big-24, lon :: integer-signed-big-24, alt :: integer-signed-big-24, 
       0x08, 0x02, batt :: integer-signed-big-16, 
       0x03, 0x71, _accx :: integer-signed-big-16, _accy :: integer-signed-big-16, _accz :: integer-signed-big-16, 
       0x05, 0x86, _gyrox :: integer-signed-big-16, _gyroy :: integer-signed-big-16, _gyroz :: integer-signed-big-16, 
       0x09, 0x02, _magx :: integer-signed-big-16, 
       0x0a, 0x02, _magy :: integer-signed-big-16, 
       0x0b, 0x02, _magz :: integer-signed-big-16>> ->
          attrs
            |> Map.put(:lat, lat * 0.0001)
            |> Map.put(:lon, lon * 0.0001)
            |> Map.put(:elevation, alt * 0.001)
            |> Map.put(:speed, 0)
            |> Map.put(:battery, batt * 0.01)
       <<lat :: integer-signed-32, lon :: integer-signed-32, elevation :: integer-signed-16, speed :: integer-signed-16>> ->
          attrs
            |> Map.put(:lat, lat / 10000000)
            |> Map.put(:lon, lon / 10000000)
            |> Map.put(:elevation, elevation)
            |> Map.put(:speed, speed)
            |> Map.put(:battery, 0)
       <<lat :: integer-signed-32, lon :: integer-signed-32, elevation :: integer-signed-16, speed :: integer-signed-16, battery :: integer-unsigned-16>> ->
          attrs
            |> Map.put(:lat, lat / 10000000)
            |> Map.put(:lon, lon / 10000000)
            |> Map.put(:elevation, elevation)
            |> Map.put(:speed, speed)
            |> Map.put(:battery, battery)
       <<lat :: integer-signed-little-32, lon :: integer-signed-little-32, _heading :: integer-6, _last_fix_failed :: integer-1 , _trip :: integer-1, speed :: integer-8, battery :: integer-8>> ->
          attrs
            |> Map.put(:lat, lat * 0.0000001)
            |> Map.put(:lon, lon * 0.0000001)
            |> Map.put(:elevation, 0)
            |> Map.put(:speed, speed)
            |> Map.put(:battery, battery)
        <<_button :: integer-1, _moving :: integer-1, _ :: integer-1, _gnssfix :: integer-1, _gnsserror :: integer-1, _ :: integer-3,
        batt :: integer-unsigned-4, _ :: integer-4,
        _temp :: integer-7, _ :: integer-1,
        lat :: integer-signed-little-28, _ :: integer-4,
        lon :: integer-signed-little-29, _ :: integer-3>> ->
          attrs
            |> Map.put(:lat, lat * 0.0000001)
            |> Map.put(:lon, lon * 0.0000001)
            |> Map.put(:elevation, 0)
            |> Map.put(:speed, 0)
            |> Map.put(:battery, (batt + 25) / 10)
        _ ->
            attrs
              |> Map.put(:lat, 0)
              |> Map.put(:lon, 0)
              |> Map.put(:elevation, 0)
              |> Map.put(:speed, 0)
              |> Map.put(:battery, 0)
    end
    attrs = if attrs.lat > 90 or attrs.lat < -90 do 
      attrs |> Map.put(:lat, 0)
    else
      attrs
    end
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