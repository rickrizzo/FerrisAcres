defmodule FerrisAcres.OrderTest do
  use FerrisAcres.ModelCase

  alias FerrisAcres.Order

  @valid_attrs %{instructions: "some content", pickup: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, placed: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, ready: true}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Order.changeset(%Order{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Order.changeset(%Order{}, @invalid_attrs)
    refute changeset.valid?
  end
end
