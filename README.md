# cerebral-log

Automatic logging for cerebral. It's an early draft with bugs and many breaking changes!

```
import CerebralLog from 'cerebral-log'

CerebralLog(controller, {
  patchConsole: false,
  globalLog: false
})
```

The logs are filtered with levels using [loglevel](https://github.com/pimterry/loglevel). The default log level is `warn`.

## Patch console

When `patchConsole = true` the global console object will be patched to use `loglevel` methods - that way you don't pollute your code with a log dependency and you can filter all calls to the standard console.

## Global log

When `globalLog = true` the `log` object from `loglevel` will be expose in the global namespace (window). This is useful to change the log level form your browsers console.

```
log.enableAll()
log.diasbleAll()
log.setLeve('info')
```

For a complete reference of `loglevel` please visit it's github repository.

## Could happen in the future

- Advanced filters (maybe based on tags?)
- Export `console` to selectively override the default console in a file
- Maybe add performance helper (e.g. timers)


Feedback, new ideas and pull request are welcome :)
