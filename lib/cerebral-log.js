import log from 'loglevel'

// Log sample:
// - setupOpened
//   setState(['loading']) { input, mutations, output }
//   setRouteParams(view='setup')
//   setState(['loading'])
// setupOpened

// Colors taken from https://github.com/mrmrs/colors
const format = createLogFormatter(
  createColorMap(
    createColorPalette([
      '#001F3F',
      '#0074D9',
      '#7FDBFF',
      '#39CCCC',
      '#3D9970',
      '#2ECC40',
      '#01FF70',
      '#FFDC00',
      '#FF851B',
      '#FF4136',
      '#F012BE',
      '#B10DC9',
      '#85144B'
    ])
  )
)

function createLogFormatter(colorMap){

  function format(text, signal) {
    let color = 0
    if (typeof signal !== 'object') {
      color = signal // Allow passing a color
    }
    else {
      color = colorMap.get(signal)
    }

    return [`%c${ text }`, `color:${ color }`]
  }

  function reset(signal) {
    colorMap.destroy(signal)
  }

  // Maybe a bit to hacky?
  format.reset = reset;

  return format
}

function createColorMap(colorPalette){
  const colorMap = {}

  function get(signal){
    const key = `${signal.name}-${signal.time}`
    if (!colorMap[key]) colorMap[key] = colorPalette.next()
    return colorMap[key]
  }

  function destroy(key){
    delete colorMap[key]
  }

  return {get, destroy}
}

function createColorPalette(colors){
  let index = 0

  return {
    next: () => {
      if (++index > colors.length) index = 0
      return colors[index]
    }
  }
}

function shouldLog(level) {
  const levels = { "trace": 0, "debug": 1, "info": 2, "warn": 3, "error": 4, "silent": 5}
  const currentLevel = log.getLevel()

  return levels[level] >= currentLevel
}

const colors = {
  black: '#181818',
  grey: '#AAAAAA'
}

function CerebralLog(controller, options) {

  controller.on('change', params => {
    if (shouldLog('debug')) {
      // if (params) {
        // const { signal } = params
        console.groupCollapsed(...format(`State changed`, colors.black))
        log.debug('  State: %O', controller.get())
        console.groupEnd()
      // }
    }
  })

  controller.on('signalStart', signal => {
    if (shouldLog('debug')) {
      console.groupCollapsed(...format(`${signal.name}`, signal))
      log.debug('Signal: %O', signal)
      if (signal.input) console.info('  Input: %O', signal.input)
      console.groupEnd()
    }
    else if (shouldLog('info')) {
      log.info(...format(`${signal.name}`, signal))
    }
  })

  controller.on('signalEnd', signal => {
    if (shouldLog('debug')) {
      console.groupCollapsed(...format(`New state after signal`, signal))
      log.debug('State: %O', controller.get())
      console.groupEnd()
      log.debug(...format(`${signal.name} ended`, colors.grey))
    }

    format.reset(signal)
  })

  controller.on('actionEnd', ({action, signal}) => {
    let name = action.name || 'unknown name'

    if (shouldLog('debug')) {
      console.groupCollapsed(...format(`- ${name}`, signal))
      if (action.input) log.debug(' Input: %O', action.input)
      if (action.output) log.debug(' Output: %O', action.output)
      if (action.mutations) log.debug(' Mutations: %O', action.mutations)
      log.debug(' Action: %O', action)
      console.groupEnd()
    }
  })

  if (options.patchConsole === true) {
    patchConsole()
  }

  if (options.globalLog === true) {
    exposeGlobalLog()
  }
}

function patchConsole() {
  const consolePatches = {
    log   : log.debug,
    debug : log.debug,
    info  : log.info,
    warn  : log.warn,
    error : log.error
  }

  Object.keys(consolePatches)
  .forEach((method) => {
    console[method] = consolePatches[method]
  })
}

function exposeGlobalLog() {
  window.log = log
}

export default CerebralLog
export {
  log,
  console
}
