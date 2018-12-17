// Page View Reducer. Follows ducks pattern http://bit.ly/2DnERMc
import { inBrowser } from 'analytics-utils'
import EVENTS from '../events'
import timeStamp from '../utils/timestamp'

export const getPageData = (pageData = {}) => {
  if (!inBrowser) return pageData
  const { title, referrer } = document
  const { location, innerWidth, innerHeight } = window
  const { hash, search, pathname, href } = location
  const page = {
    title: title,
    url: href,
    path: pathname,
    hash: hash,
    search: search,
    width: innerWidth,
    height: innerHeight,
    ...pageData
  }
  if (referrer && referrer !== '') {
    page.referrer = referrer
  }
  return page
}

// initialState Page Data
const initialState = {
  ...getPageData(),
  abort: []
}

// page reducer
export default function page(state = initialState, action) {
  switch (action.type) {
    // Todo decide if this is worth it...
    // Allows for plugin level cancelation by aborting the timestamp trace id of an action
    case 'Abort':
      return Object.assign({}, state, {
        abort: state.abort.concat(action.timestamp)
      })
    case EVENTS.PAGE:
      return Object.assign({}, state, action.data)
    default:
      return state
  }
}

export const pageView = (data, options, callback) => {
  return {
    type: EVENTS.PAGE_INIT,
    timestamp: timeStamp(),
    data: { ...getPageData(), ...data },
    options: options,
    callback: callback
  }
}
