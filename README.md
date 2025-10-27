mp3to
=================

mp3 converter tool


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mp3to.svg)](https://npmjs.org/package/mp3to)
[![Downloads/week](https://img.shields.io/npm/dw/mp3to.svg)](https://npmjs.org/package/mp3to)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mp3to
$ mp3to COMMAND
running command...
$ mp3to (--version)
mp3to/1.0.0 win32-x64 node-v22.21.0
$ mp3to --help [COMMAND]
USAGE
  $ mp3to COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mp3to convert`](#mp3to-convert)
* [`mp3to help [COMMAND]`](#mp3to-help-command)
* [`mp3to plugins`](#mp3to-plugins)
* [`mp3to plugins add PLUGIN`](#mp3to-plugins-add-plugin)
* [`mp3to plugins:inspect PLUGIN...`](#mp3to-pluginsinspect-plugin)
* [`mp3to plugins install PLUGIN`](#mp3to-plugins-install-plugin)
* [`mp3to plugins link PATH`](#mp3to-plugins-link-path)
* [`mp3to plugins remove [PLUGIN]`](#mp3to-plugins-remove-plugin)
* [`mp3to plugins reset`](#mp3to-plugins-reset)
* [`mp3to plugins uninstall [PLUGIN]`](#mp3to-plugins-uninstall-plugin)
* [`mp3to plugins unlink [PLUGIN]`](#mp3to-plugins-unlink-plugin)
* [`mp3to plugins update`](#mp3to-plugins-update)

## `mp3to convert`

Convert all MP3 files in the current directory to OGG, AAC/M4A, or FLAC format

```
USAGE
  $ mp3to convert [-f ogg|m4a|flac] [-q <value>]

FLAGS
  -f, --format=<option>  [default: ogg] Output format (ogg, m4a, flac)
                         <options: ogg|m4a|flac>
  -q, --quality=<value>  [default: 5] Quality setting (0-10, where 0 is highest quality and 10 is lowest)

DESCRIPTION
  Convert all MP3 files in the current directory to OGG, AAC/M4A, or FLAC format

EXAMPLES
  $ mp3to convert

  $ mp3to convert --format ogg

  $ mp3to convert --format m4a --quality 5

  $ mp3to convert --format flac --quality 0

  $ mp3to convert --quality 8
```

_See code: [src/commands/convert.ts](https://github.com/kaanguru/mp3to/blob/v1.0.0/src/commands/convert.ts)_

## `mp3to help [COMMAND]`

Display help for mp3to.

```
USAGE
  $ mp3to help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mp3to.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.34/src/commands/help.ts)_

## `mp3to plugins`

List installed plugins.

```
USAGE
  $ mp3to plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ mp3to plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.51/src/commands/plugins/index.ts)_

## `mp3to plugins add PLUGIN`

Installs a plugin into mp3to.

```
USAGE
  $ mp3to plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into mp3to.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MP3TO_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MP3TO_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ mp3to plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ mp3to plugins add myplugin

  Install a plugin from a github url.

    $ mp3to plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ mp3to plugins add someuser/someplugin
```

## `mp3to plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ mp3to plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ mp3to plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.51/src/commands/plugins/inspect.ts)_

## `mp3to plugins install PLUGIN`

Installs a plugin into mp3to.

```
USAGE
  $ mp3to plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into mp3to.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MP3TO_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MP3TO_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ mp3to plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ mp3to plugins install myplugin

  Install a plugin from a github url.

    $ mp3to plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ mp3to plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.51/src/commands/plugins/install.ts)_

## `mp3to plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ mp3to plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ mp3to plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.51/src/commands/plugins/link.ts)_

## `mp3to plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mp3to plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mp3to plugins unlink
  $ mp3to plugins remove

EXAMPLES
  $ mp3to plugins remove myplugin
```

## `mp3to plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ mp3to plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.51/src/commands/plugins/reset.ts)_

## `mp3to plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mp3to plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mp3to plugins unlink
  $ mp3to plugins remove

EXAMPLES
  $ mp3to plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.51/src/commands/plugins/uninstall.ts)_

## `mp3to plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mp3to plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mp3to plugins unlink
  $ mp3to plugins remove

EXAMPLES
  $ mp3to plugins unlink myplugin
```

## `mp3to plugins update`

Update installed plugins.

```
USAGE
  $ mp3to plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.51/src/commands/plugins/update.ts)_
<!-- commandsstop -->
