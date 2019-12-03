defmodule CargoElixirWeb.Router do
  use CargoElixirWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", CargoElixirWeb do
    pipe_through :api

    get "/oui/:oui/devices", PayloadController, :get_devices
    post "/payloads", PayloadController, :create
  end

  scope "/", CargoElixirWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
