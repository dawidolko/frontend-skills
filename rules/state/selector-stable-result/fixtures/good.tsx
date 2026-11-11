import { shallowEqual, useSelector } from 'react-redux'
import { useShallow } from 'zustand/react/shallow'
import { useAppSelector, useCounterStore, selectDoneTodos } from './store'

export function Counter() {
  const count = useCounterStore((s) => s.count)
  const [a, b] = useCounterStore(useShallow((s) => [s.a, s.b]))
  const pair = useSelector((state: State) => ({ x: state.x, y: state.y }), shallowEqual)
  const done = useAppSelector(selectDoneTodos)
  const todos = useAppSelector((state) => state.todos)
  const open = todos.filter((t) => !t.done)
  const store = useCounterStore()
  const user = useSelector((state: State) => state.users.find((u) => u.id === state.current))
  return <p>{count} {a + b} {pair.x} {done.length} {open.length} {store.count} {user?.name}</p>
}
