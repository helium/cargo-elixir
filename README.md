# CargoElixir

<img width="1675" alt="Screen Shot 2020-11-12 at 12 58 20 PM" src="https://user-images.githubusercontent.com/13011150/98996286-70983280-24e7-11eb-94cb-041416225e40.png">

Cargo is a visualization tool for asset trackers. As part of our strategy we are making this application available as open source.

Helium Console has a pre-built Console integration that makes it easy to quickly view a tracker’s physical location.

## Development Environment

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `cd assets && yarn`
  * Navigate back to root directory with `cd ..`
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


## Common Errors

### Node Version

The error `[error] Task #PID<0.470.0> started from CargoElixirWeb.Endpoint terminating` is often the result of the incorrect Node version being used.

**Current Solution:** use Node v16, tools like `nvm` are great for switching verions in your developer environment

**Walkthrough:**
1. verify current Node version with `node --version`
2. install `nvm` with

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.nvm/nvm.sh
```

3. Switch Node version with:

```bash
nvm install 16
nvm use 16
```

4. verify Node version did switch to v16 with `node --version`