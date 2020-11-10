# CargoElixir

## Development Environment

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `cd assets && yarn`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Running with Docker

  * Clone the repo and `cd cargo-elixir`
  * Follow instructions at the bottom of `/config/prod.exs`
  * Follow instructions at the top of `/assets/js/pages/MapScreen.js`
  * Update host in `/config/releases.exs`
  * Build with `docker-compose build`
  * Generate secret key with `mix phx.gen.secret`
  * Set environment variable `export SECRET_KEY_BASE=<above generated secret>`
  * Run with `docker-compose up`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.
