# DevToolsUB native bridge

This directory contains an optional C++ Native Messaging host for Chrome/Chromium.

## Build

On a Linux/ChromeOS Linux environment with a C++ compiler:

```sh
g++ -std=c++17 -O2 -o devtoolsub_host devtoolsub_host.cc
```

Then create the native host manifest from `devtoolsub_host.json.example`, replacing:

- `/ABSOLUTE/PATH/TO/devtoolsub_host` with the executable's absolute path.
- `YOUR_EXTENSION_ID` with the installed extension ID.

The host must be registered in a location supported by the Chrome/Chromium installation. ChromeOS device/admin policy may prevent native messaging entirely.

## Important limitation

An extension cannot turn Chrome's built-in Developer Tools on or bypass an administrator's ChromeOS policy. The switch in DevToolsUB controls this extension's custom/native inspection bridge. If Chrome itself has DevTools disabled by policy, the extension cannot override that restriction.
