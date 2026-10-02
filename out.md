
## chromium 153.0.8010.12

| link | `scrollY` after navigation | `<h1>` top | expected |
| --- | --- | --- | --- |
| Section | 1040 ❌ | -1019 | 0 |
| Flat | 0 | 21 | 0 |

## firefox 155.0

| link | `scrollY` after navigation | `<h1>` top | expected |
| --- | --- | --- | --- |
| Section | 1048 ❌ | -1026 | 0 |
| Flat | 0 | 21 | 0 |

## webkit 26.6

| link | `scrollY` after navigation | `<h1>` top | expected |
| --- | --- | --- | --- |
| Section | 1046 ❌ | -1025 | 0 |
| Flat | 0 | 21 | 0 |
