import 'intersection-observer'
// import '@formatjs/intl-datetimeformat/polyfill'
// import '@formatjs/intl-datetimeformat/locale-data/de'
import closest from 'element-closest'
import smoothscroll from 'smoothscroll-polyfill'

// kick off the polyfill!
smoothscroll.polyfill()
closest(window) // enable closest match polyfill
// import includes from 'core-js/library/fn/string/virtual/includes'
// import repeat from 'core-js/library/fn/string/virtual/repeat'
// import assign from 'core-js/library/fn/object/assign'
// String.prototype.includes = includes
// String.prototype.repeat = repeat
// Object.assign = assign
