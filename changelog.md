# Changelog

## [0.5.0] - 2026-05-18

### Added

Five new generic utilities:

- **`addFrontmatterField(content, key, value)`**: Adds a key/value field to YAML frontmatter blocks. No-op when the field already exists or no frontmatter is present.
- **`promptUser(question)`**: Async interactive yes/no stdin prompt returning a boolean (`y`/`yes` → true, anything else → false; case-insensitive, trims whitespace).
- **`setupSigintHandler(stopCallback)`**: Registers a `SIGINT` handler that awaits an async cleanup callback before exiting with code 0.
- **`detectEnvironments(cwd)`**: Detects AI tooling environments (`copilot`, `cursor`, `claude`) by checking for `.cursor/`, `.github/`, `.claude/` directories or `CLAUDE.md`. Returns `DetectedEnvironment[]`.
- **`cleanupOrphanedTempDirs(parentDir, prefix, log)`**: Removes all subdirectories whose name starts with a given prefix. Useful for cleaning up interrupted build/test runs. Logs each removal through the injected `Logger`.

Full test coverage (35+ new tests) and concurrent-safe.

## [0.4.0] - 2026-02-15

### Added

- **Logger system**: Generic logging abstraction for standardized logging across the ecosystem
  - `Logger` interface: Standard interface with `log`, `error`, `warn`, `info` methods
  - `logger`: Default implementation using console methods
  - `silentLogger`: No-op logger for silent operation (useful in production or tests)
  - `createTestLogger()`: Captures logs in arrays for testing and verification
  - Full TypeScript support with exported types
  - Comprehensive test coverage (45 tests across 3 test files)

### Documentation

- Logger system fully tested with edge cases (null, undefined, Error objects, mixed types)
- Test logger supports independent instances and manual array manipulation

## [0.3.0] - 2026-02-15

### Added

- Configured trusted publisher with OIDC for npm deployment
- Added `lint` script using Prettier for code formatting
- Added Prettier as devDependency

### Changed

- Updated npm deployment workflow to use OIDC authentication instead of NPM_TOKEN
- Standardized repository URL format in package.json
- Code formatting applied across all source and test files

### Infrastructure

- GitHub Actions now uses `permissions: id-token: write` for secure publishing
- npm publish now includes `--provenance` flag for supply chain security
- Node.js version standardized to `lts/*` in CI workflow

## [0.2.2] - Previous releases

(Previous version history not documented)
