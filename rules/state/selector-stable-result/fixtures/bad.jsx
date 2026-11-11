import { useSelector } from 'react-redux'
import { useCounterStore } from './store'

export function Counter() {
  const { count, inc } = useCounterStore((s) => ({ count: s.count, inc: s.inc }))
  const done = useSelector((state) => state.todos.filter((t) => t.done))
  const [a, b] = useCounterStore((s) => [s.a, s.b])
  return <button type="button" onClick={inc}>{count} {done.length} {a + b}</button>
}
