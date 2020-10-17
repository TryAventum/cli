# Aventum CLI

CLI app to help you in your journey with [Aventum](https://aventum.org)!

## Table of Contents

1.  [Documentation](#documentation)
    1.  [Requirements](#requirements)
    2.  [Installation](#installation)
    3.  [Usage](#usage)
    4.  [How it works?](#how-it-works)
    5.  [Commands](#commands)
2.  [Support](#support)
3.  [License](#license)

## [Documentation](#documentation)

### Requirements

1. [Node.js](https://nodejs.org).
2. [Git](https://git-scm.com).

### Installation

Run:

```shell
npm install @aventum/cli -g
```

### Usage

Go to an empty folder that you have permissions to write into it and run:

```shell
aventum create -r
```

### How it works

Aventum CLI download, configure, build, and run the Aventum app for you.

### Commands

1. [create/c](#createc)
2. [server-configurations/sc](#server-configurationssc)
3. [run/r](#runr)

### `create/c`

Create Aventum app.

#### Options

|          Option           | Description                                                   | Default |
| :-----------------------: | ------------------------------------------------------------- | :-----: |
| `-dp`, `--dashboard-port` | Set dashboard port.                                           | `3333`  |
|     `-d`, `--docker`      | Create Aventum app using Docker Compose template.             |         |
|       `-r`, `--run`       | Run Aventum app, only work if it is not a docker compose app. |         |

#### Examples

Create and run Aventum app and use port `3500` for the dashboard.

```shell
aventum c -r -dp 3500
```

same as

```shell
aventum create -r -dp 3500
```

### `server-configurations/sc`

Reset/regenerate Aventum server configurations.

#### Options

|     Option      | Description                                                                                                                                                                                | Default |
| :-------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-----: |
| `-b`, `--build` | Build Aventum dashboard, because if you changed the server port you may want to update REACT_APP_BASE_URL in .env.production of the dashboard and rebuild it, this option do this for you. |         |

#### Examples

Generate server configurations and rebuild the dashboard.

```shell
aventum sc --build
```

same as

```shell
aventum server-configurations --build
```

### `run/r`

Run Aventum app that doesn't created using Docker Compose template and created previously using Aventum CLI.

#### Options

|          Option           | Description         | Default |
| :-----------------------: | ------------------- | :-----: |
| `-dp`, `--dashboard-port` | Set dashboard port. | `3333`  |

#### Examples

Run Aventum app and set the dashboard port to `3500`

```shell
aventum r -dp 3500
```

same as

```shell
aventum run -dp 3500
```

To get help run:

```
aventum -h
```

or

```
aventum --help
```

## Support

You are welcome to contribute code and provide pull requests for Aventum CLI, also please feel free to suggest or request any features or enhancements.

## License

Copyright (c) 2020 [Mohammed Al-Mahdawi](https://al-mahdawi.com/)
Licensed under the **MIT** license.
