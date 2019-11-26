defmodule CargoElixir.Repo.Migrations.CreatePayloads do
  use Ecto.Migration

  def change do
    create table(:payloads, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :device_id, :integer, null: false
      add :hotspot_id, :string, null: false
      add :oui, :integer, null: false
      add :lat, :decimal, null: false
      add :lon, :decimal, null: false
      add :speed, :decimal, null: false
      add :rssi, :decimal, null: false
      add :elevation, :decimal, null: false
      add :battery, :decimal, null: false
      add :seq_num, :integer, null: false
      add :reported, :utc_datetime, null: false
      add :created_at, :utc_datetime, null: false
    end

    create index(:payloads, [:created_at])
    create index(:payloads, [:device_id])
    create index(:payloads, [:lat, :lon])
    create index(:payloads, [:oui, :device_id, "created_at DESC"])
  end
end
