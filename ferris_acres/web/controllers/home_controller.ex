defmodule FerrisAcres.HomeController do
  use FerrisAcres.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

end
