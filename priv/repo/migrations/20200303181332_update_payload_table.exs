defmodule CargoElixir.Repo.Migrations.UpdatePayloadTablew do
  use Ecto.Migration

  def change do
    alter table("payloads") do
      add :name, :string
      modify :device_id, :string, null: false
    end
  end
end
