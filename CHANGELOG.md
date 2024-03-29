# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [0.10] - 2024-03-05

### Changed

- Skips errored files instead of abort downloading ([commit](https://github.com/sinoru/patron-media-collector/commit/ae673c3d))
- Rename PatronMediaCollector from PatronMediaDownload due to Apple ([commit](https://github.com/sinoru/patron-media-collector/commit/57daf748))

### Fixed

- Fix download not properly from Patreon ([commit](https://github.com/sinoru/patron-media-collector/commit/ea65c3c3))

## [0.9.1] - 2024-02-22

### Fixed

- Fix download not properly on Safari sometimes ([commit](https://github.com/sinoru/patron-media-collector/commit/160c5cf0))

## [0.9] - 2024-02-22

### Changed

- Update button real-time when web contents changed ([commit](https://github.com/sinoru/patron-media-collector/commit/5927ddcf))

### Fixed

- Fix not working on Chrome ([commit](https://github.com/sinoru/patron-media-collector/commit/1af564a7))

## [0.8] - 2024-02-21

### Added

- Back to support Chrome again ([commit](https://github.com/sinoru/patron-media-collector/commit/d350c69a))

### Changed

- Change to Manifest v3 ([commit](https://github.com/sinoru/patron-media-collector/commit/f9572f6f))
- Make it downloading more reliable on Safari ([commit](https://github.com/sinoru/patron-media-collector/commit/3c8f9d07), [commit](https://github.com/sinoru/patron-media-collector/commit/b260488e), [commits](https://github.com/sinoru/patron-media-collector/compare/7f79b541~1...b565670b))
- Drop to use Storage API for more lightweight ([commit](https://github.com/sinoru/patron-media-collector/commit/451c9ef1))
- Drop to use duplicated webextension-polyfill due to diffrent entry ([commit](https://github.com/sinoru/patron-media-collector/commit/b20116a3))

## [0.7] - 2024-02-20

### Changed

- Change to Manifest v2 ([commit](https://github.com/sinoru/patron-media-collector/commit/9d731e81))

### Removed

- Drop Chrome support ([commit](https://github.com/sinoru/patron-media-collector/commit/9c8cc4a3))

### Fixed

- Fix a issus that downloads wrong file due to lack of cookie on Safari ([commit](https://github.com/sinoru/patron-media-collector/commit/9d731e81))

## [0.6.1] - 2024-02-20

### Changed

- Nothing but bump version up

## [0.6] - 2024-02-20

### Changed

- Enhance overall reliability ([commit](https://github.com/sinoru/patron-media-collector/commit/c2885ea9), [commit](https://github.com/sinoru/patron-media-collector/commit/285776e0))
- Enhance downloading performance and reliability on Safari ([commits](https://github.com/sinoru/patron-media-collector/compare/fcc9ad24~1...7ee9f382))
- Disable download button while downloading ([commit](https://github.com/sinoru/patron-media-collector/commit/55721a3f), [commit](https://github.com/sinoru/patron-media-collector/commit/4c9b61f3))

## [0.5] - 2024-02-18

### Changed

- Update popup layout ([commit](https://github.com/sinoru/patron-media-collector/commit/5465d5d8))
- Update internal messaging part for future-proof ([commit](https://github.com/sinoru/patron-media-collector/commit/dc48b5a3))
- Update `npm run dev` command to work ([commit](https://github.com/sinoru/patron-media-collector/commit/e9837af9))

## [0.4] - 2024-02-11

### Changed

- Update download button UI ([commits](https://github.com/sinoru/patron-media-collector/compare/08c2a2e6~1...1c2a92b1))
- Add pre-number only to Fanbox images not all ([commit](https://github.com/sinoru/patron-media-collector/commit/c046bbc0))
- Update icon ([commits](https://github.com/sinoru/patron-media-collector/compare/32ac0104~1...a4003379))

### Fixed

- Fix parameter name mismatch in type hint ([commit](https://github.com/sinoru/patron-media-collector/commit/6208379f))

## [0.3.1] - 2024-02-10

### Added

- Chrome browser supports.

## [0.3] - 2024-02-09

[unreleased]: https://github.com/sinoru/patron-media-collector/compare/v0.10...develop
[0.10]: https://github.com/sinoru/patron-media-collector/compare/v0.9.1...v0.10
[0.9.1]: https://github.com/sinoru/patron-media-collector/compare/v0.9...v0.9.1
[0.9]: https://github.com/sinoru/patron-media-collector/compare/v0.8...v0.9
[0.8]: https://github.com/sinoru/patron-media-collector/compare/v0.7...v0.8
[0.7]: https://github.com/sinoru/patron-media-collector/compare/v0.6.1...v0.7
[0.6.1]: https://github.com/sinoru/patron-media-collector/compare/v0.6...v0.6.1
[0.6]: https://github.com/sinoru/patron-media-collector/compare/v0.5...v0.6
[0.5]: https://github.com/sinoru/patron-media-collector/compare/v0.4...v0.5
[0.4]: https://github.com/sinoru/patron-media-collector/compare/v0.3.1...v0.4
[0.3.1]: https://github.com/sinoru/patron-media-collector/compare/v0.3...v0.3.1
[0.3]: https://github.com/sinoru/patron-media-collector/releases/tag/v0.3
