defmodule CargoElixir.Payloads do
  import Ecto.Query, warn: false
  alias CargoElixir.Repo

  alias CargoElixir.Payloads.Payload
  def find_key(decoded, key, acc) do
      Enum.reduce(decoded, acc, fn{k, v}, acc ->
          cond do
            String.equivalent?(k, key) -> [v | acc]
            is_map(v) -> find_key(v, key, acc)
            true -> acc
          end
      end)
  end

  def parse_decoded(attrs, decoded) do

    # required fields
    lat = find_key(decoded, "latitude", [])
    attrs = if Enum.empty?(lat) do
      throw RuntimeError
    else
      if is_float(Enum.at(lat, 0)) or is_integer(Enum.at(lat, 0)) do
        Map.put(attrs, :lat, Enum.at(lat, 0))
      else
        Map.put(attrs, :lat, Kernel.elem(Float.parse(Enum.at(lat, 0)), 0))
      end
    end

    lon = find_key(decoded, "longitude", [])
    attrs = if Enum.empty?(lon) do
      throw RuntimeError
    else
     if is_float(Enum.at(lon, 0)) or is_integer(Enum.at(lon, 0)) do
        Map.put(attrs, :lon, Enum.at(lon, 0))
      else
        Map.put(attrs, :lon, Kernel.elem(Float.parse(Enum.at(lon, 0)), 0))
      end
    end

    elevation = find_key(decoded, "altitude", [])
    attrs = if Enum.empty?(elevation) do
      throw RuntimeError
    else
      if is_float(Enum.at(elevation, 0)) or is_integer(Enum.at(elevation, 0)) do
        Map.put(attrs, :elevation, Enum.at(elevation, 0))
      else
        Map.put(attrs, :elevation, Kernel.elem(Float.parse(Enum.at(elevation, 0)), 0))
      end
    end

    # optional fields
    battery = find_key(decoded, "battery", [])
    attrs = if Enum.empty?(battery) do
      Map.put(attrs, :battery, 0)
    else
      if is_float(Enum.at(battery, 0)) or is_integer(Enum.at(battery, 0)) do
        Map.put(attrs, :battery, Enum.at(battery, 0))
      else
        Map.put(attrs, :battery, Kernel.elem(Float.parse(Enum.at(battery, 0)), 0))
      end
    end

    speed = find_key(decoded, "speed", [])
    attrs = if Enum.empty?(speed) do
      Map.put(attrs, :speed, 0)
    else
      if is_float(Enum.at(speed, 0)) or is_integer(Enum.at(speed, 0)) do
        Map.put(attrs, :speed, Enum.at(speed, 0))
      else
        Map.put(attrs, :speed, Kernel.elem(Float.parse(Enum.at(speed, 0)), 0))
      end
    end

    # lat validation
    if attrs.lat > 90 or attrs.lat < -90 do
      attrs |> Map.put(:lat, 0)
    else
      attrs
    end
  end

  def create_payload(packet = %{ "id" => device_id, "dev_eui" => dev_eui, "name" => name, "hotspots" => hotspots, "payload" => payload, "fcnt" => fcnt, "reported_at" => reported }) do
    first_hotspot = List.first(hotspots)

    attrs = %{}
      |> Map.put(:device_id, device_id)
      |> Map.put(:name, name)
      |> Map.put(:hotspot_id, Map.fetch!(first_hotspot, "name"))
      |> Map.put(:oui, 1)
      |> Map.put(:rssi, Map.fetch!(first_hotspot, "rssi"))
      |> Map.put(:seq_num, fcnt)
      |> Map.put(:reported, round(reported / 1000) |> DateTime.from_unix!())
      |> Map.put(:snr, Map.fetch!(first_hotspot, "snr"))

    binary = payload |> :base64.decode()

    attrs = if Map.has_key?(packet, "decoded") do
      try do
        parse_decoded(attrs, Map.get(packet, "decoded"))
      catch
        RuntimeError -> decode_payload(binary, attrs, dev_eui)
      end
    else
      decode_payload(binary, attrs, dev_eui)
    end

    %Payload{}
    |> Payload.changeset(attrs)
    |> Repo.insert()
  end

  def create_payload(packet = %{ "device_id" => device_id, "gateway" => hotspot_id, "oui" => oui, "lat" => lat, "lon" => lon, "speed" => speed, "elevation" => elevation,
    "battery" => battery, "rssi" => rssi, "snr" => snr, "sequence" => seq_num, "timestamp" => reported}) do
    attrs = %{}
      |> Map.put(:device_id, device_id)
      |> Map.put(:name, device_id)
      |> Map.put(:hotspot_id, hotspot_id)
      |> Map.put(:oui, oui)
      |> Map.put(:lat, lat)
      |> Map.put(:lon, lon)
      |> Map.put(:speed, speed)
      |> Map.put(:rssi, rssi)
      |> Map.put(:elevation, elevation)
      |> Map.put(:battery, battery)
      |> Map.put(:seq_num, seq_num)
      |> Map.put(:reported, round(reported / 1000) |> DateTime.from_unix!())
      |> Map.put(:snr, snr)

    %Payload{}
      |> Payload.changeset(attrs)
      |> Repo.insert()
  end

  def decode_payload(binary, attrs, dev_eui) do
    attrs = case binary do
      # RAK7200
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
      # Dragino LGT-92
      <<lat :: integer-signed-32, lon :: integer-signed-32, _ :: integer-signed-1, _alarm :: integer-signed-1, battery :: integer-signed-14,
        _md :: integer-signed-2, _ln :: integer-signed-1, 3 :: integer-signed-5>> ->
          attrs
            |> Map.put(:lat, lat / 1000000)
            |> Map.put(:lon, lon / 1000000)
            |> Map.put(:elevation, 0)
            |> Map.put(:speed, 0)
            |> Map.put(:battery, battery / 1000)
      # Browan Object Locator
      << 0 :: integer-1, 0 :: integer-1, 0 :: integer-1, _gnsserror :: integer-1, _gnssfix :: integer-1, _ :: integer-1, _moving :: integer-1, _button :: integer-1,
      _ :: integer-4, batt :: integer-unsigned-4,
      _ :: integer-1, _temp :: integer-7,
      lat :: integer-signed-little-32,
      temp_lon :: integer-signed-little-24, _accuracy :: integer-3, i :: integer-unsigned-5>> ->
        <<lon :: integer-signed-little-29>> = <<temp_lon :: unsigned-little-24, i :: unsigned-5>>
          attrs
            |> Map.put(:lat, lat / 1000000)
            |> Map.put(:lon, lon / 1000000)
            |> Map.put(:elevation, 0)
            |> Map.put(:speed, 0)
            |> Map.put(:battery, (batt + 25) / 10)
      # Helium/Arduino without battery
      <<lat :: integer-signed-32, lon :: integer-signed-32, elevation :: integer-signed-16, speed :: integer-signed-16>> ->
          attrs
            |> Map.put(:lat, lat / 10000000)
            |> Map.put(:lon, lon / 10000000)
            |> Map.put(:elevation, elevation)
            |> Map.put(:speed, speed)
            |> Map.put(:battery, 0)
      # Helium/Arduino with battery
      <<lat :: integer-signed-32, lon :: integer-signed-32, elevation :: integer-signed-16, speed :: integer-signed-16, battery :: integer-unsigned-16>> ->
          attrs
            |> Map.put(:lat, lat / 10000000)
            |> Map.put(:lon, lon / 10000000)
            |> Map.put(:elevation, elevation)
            |> Map.put(:speed, speed)
            |> Map.put(:battery, battery)
      # DigitalMatter Oyster/Yabby
      <<lat :: integer-signed-little-32, lon :: integer-signed-little-32, _heading :: integer-6, _last_fix_failed :: integer-1 , _trip :: integer-1, speed :: integer-8, battery :: integer-8>> ->
          attrs
            |> Map.put(:lat, lat * 0.0000001)
            |> Map.put(:lon, lon * 0.0000001)
            |> Map.put(:elevation, 0)
            |> Map.put(:speed, speed)
            |> Map.put(:battery, (battery * 25) / 1000)
      # Keyco Tracker
      <<_company :: integer-16, _product :: integer-24, _version :: integer-8, _major :: integer-16, _minor :: integer-16, _deveui :: integer-32, _timestamp :: integer-32,
      lat :: float-32, lon :: float-32, elevation :: integer-16, speed :: integer-16, _hdop :: integer-24, _gpsnum :: integer-8, _ :: integer-32, battery :: integer-8, _ :: integer-80>> ->
          # send to Keyco app server
          HTTPoison.post "https://keycoiot-eu.solu-m.com/keyco/iotrestapi/solum/helium", "{\"latitude\": #{lat}, \"longitude\": #{lon}, \"deveui\": \"#{dev_eui}\", \"encryption\": 1, \"payload\": \"#{:base64.encode(binary)}\"}", [{"Content-Type", "application/json"}]
          attrs
            |> Map.put(:lat, lat)
            |> Map.put(:lon, lon)
            |> Map.put(:elevation, round(elevation * 0.1))
            |> Map.put(:speed, round((speed * 0.1) * 0.6214))
            |> Map.put(:battery, (4/100) * battery)
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
    attrs
  end

  def get_devices() do
    current_unix = DateTime.utc_now() |> DateTime.truncate(:second) |> DateTime.to_unix()
    date_threshold = DateTime.from_unix!(current_unix - 259200)

    query = from p in Payload,
      where: p.created_at > ^date_threshold,
      order_by: [desc: p.created_at],
      distinct: p.device_id,
      select: %{name: p.name, device_id: p.device_id, created_at: p.created_at, hotspot: p.hotspot_id, lat: p.lat, lon: p.lon}
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

  def get_all_payloads(oui) do
    time_limit = DateTime.utc_now() |> DateTime.add(-3600, :second)
    query = from p in Payload,
      where: (p.oui == ^oui and p.created_at > ^time_limit),
      select: %{ device_id: p.device_id, name: p.name, lat: p.lat, lon: p.lon, created_at: p.created_at }
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
