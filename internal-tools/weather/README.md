# Weather app

The weather app consists of the API and static frontend. Both images use the
same app version and are released together.

## Releases

Weather app pull requests targeting `main` must use one of these titles:

- `feat!: <what is changing>` for a major version bump.
- `feat: <what is changing>` for a minor version bump.
- `fix: <what is changing>` for a patch version bump.

Major changes must include a non-empty `## Breaking Changes` section in the
PR description. Include a Release Please commit override in that section so the
breaking-change details appear in the changelog:

```text
## Breaking Changes

BEGIN_COMMIT_OVERRIDE
feat!: <what is changing>

BREAKING CHANGE: <describe what breaks and any migration needed>
END_COMMIT_OVERRIDE
```

After weather app changes merge, Release Please opens or updates one release
PR. Merging it updates `version.txt` and `CHANGELOG.md`, creates a `v`-prefixed
GitHub release, and builds both images with the version tag and `latest`:

- `ghcr.io/<owner>/weather-api:<version>`
- `ghcr.io/<owner>/weather-app-frontend:<version>`

The initial app version is `0.1.0`.
