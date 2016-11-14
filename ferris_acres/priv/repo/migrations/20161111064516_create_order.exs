defmodule FerrisAcres.Repo.Migrations.CreateOrder do
  use Ecto.Migration

  def change do
    create table(:orders) do
      add :placed, :datetime
      add :pickup, :datetime
      add :instructions, :text
      add :ready, :boolean, default: false, null: false
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:orders, [:user_id])

  end
end
