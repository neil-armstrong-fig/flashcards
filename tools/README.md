# tools

Command-line tools that make content for the app. Today that is the audio generator: it asks Azure AI Speech for every recording the decks need, writes the manifest into `content/`, and uploads the files to the API's bucket.

Nothing imports this package. It imports `shared` and `content`. See [AGENTS.md](AGENTS.md).
