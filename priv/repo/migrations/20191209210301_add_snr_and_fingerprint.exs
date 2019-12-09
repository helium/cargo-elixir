defmodule CargoElixir.Repo.Migrations.AddSnrAndFingerprint do
  use Ecto.Migration

  def change do
    alter table(:payloads, primary_key: false) do
      add :fingerprint, :string, default: "none", null: false
      add :snr, :decimal, default: 0, null: false
    end
  end
end
