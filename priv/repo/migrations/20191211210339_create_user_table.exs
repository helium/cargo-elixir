defmodule CargoElixir.Repo.Migrations.CreateUserTable do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :first_name, :string, null: false
      add :last_name, :string, null: false
      add :company_name, :string, null: false
      add :email, :string, null: false
      add :developer, :boolean, null: false, default: false

      timestamps()
    end

    create index(:users, [:email])
    create index(:users, [:company_name])
  end
end
