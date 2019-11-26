defmodule CargoElixir.Payloads.Payload do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "payloads" do
    field :device_id, :integer
    field :hotspot_id, :string
    field :oui, :integer
    field :lat, :decimal
    field :lon, :decimal
    field :speed, :decimal
    field :rssi, :decimal
    field :elevation, :decimal
    field :battery, :decimal
    field :seq_num, :integer
    field :reported, :utc_datetime
    field :created_at, :utc_datetime
  end

  def changeset(payload, attrs) do
    changeset =
      payload
      |> cast(attrs, [:device_id, :hotspot_id, :oui, :lat, :lon, :speed, :rssi, :elevation, :battery, :seq_num, :reported])
      |> put_change(:created_at, DateTime.utc_now |> DateTime.truncate(:second))
      |> validate_required([:device_id, :hotspot_id, :oui, :lat, :lon, :speed, :rssi, :elevation, :battery, :seq_num, :reported, :created_at])
  end
end
