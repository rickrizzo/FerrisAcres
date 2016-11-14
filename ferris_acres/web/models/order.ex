defmodule FerrisAcres.Order do
  use FerrisAcres.Web, :model

  schema "orders" do
    field :placed, Ecto.DateTime
    field :pickup, Ecto.DateTime
    field :instructions, :string
    field :ready, :boolean, default: false
    belongs_to :user, FerrisAcres.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:placed, :pickup, :instructions, :ready])
    |> validate_required([:placed, :pickup, :instructions, :ready])
  end
end
