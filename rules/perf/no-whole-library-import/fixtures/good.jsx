import { debounce } from 'lodash-es'
import throttle from 'lodash/throttle'
// import moment from 'moment' was removed
const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' })

export const label = (d) => dateFormat.format(d)
export const onType = debounce(() => {}, 200)
export const onScroll = throttle(() => {}, 100)
