# Security Policy
NOVA stores data only on the device and makes no network calls. If you find a vulnerability (for example a data-leak or an unsafe dependency), please report it privately to the maintainers instead of opening a public issue. Include steps to reproduce. We aim to respond within 7 days.
Never commit secrets: `.env` is git-ignored; use EAS secrets for build-time values.
