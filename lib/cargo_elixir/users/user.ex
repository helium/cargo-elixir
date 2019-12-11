defmodule CargoElixir.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :company_name, :string
    field :email, :string
    field :developer, :boolean
    field :reported, :utc_datetime
    field :created_at, :utc_datetime

    timestamps()
  end

  def changeset(user, attrs) do
    changeset =
      user
      |> cast(attrs, [:first_name, :last_name, :company_name, :email, :developer])
      |> validate_required([:first_name, :last_name, :company_name, :email, :developer])
  end
end
