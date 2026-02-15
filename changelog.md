# Changelog

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
