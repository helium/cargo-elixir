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
    plug CORSPlug, origin: "*"
    plug :accepts, ["json"]
  end

  scope "/api", CargoElixirWeb do
    pipe_through :api

    get "/oui/:oui", PayloadController, :get_devices
    get "/devices/:id", PayloadController, :get_payloads
    options "/oui/:oui", PayloadController, :options
    options "/devices/:id", PayloadController, :options
    get "/stats", PayloadController, :get_stats
    get "/console_stats", PageController, :get_console_stats
    post "/payloads", PayloadController, :create
    post "/signup", UserController, :create
  end

  scope "/", CargoElixirWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
