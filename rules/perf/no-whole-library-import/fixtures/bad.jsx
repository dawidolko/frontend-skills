import _ from 'lodash'
import { debounce } from "lodash"
import moment from 'moment'

export const label = (d) => moment(d).format('LL') + _.capitalize('x')
export const onType = debounce(() => {}, 200)
