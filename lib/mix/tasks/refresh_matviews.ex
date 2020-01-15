defmodule Mix.Tasks.RefreshMatviews do
  use Mix.Task

  def run(db) do
    Mix.shell.cmd("psql -a #{db} -c 'select refresh_all_matviews()'")
  end
end
