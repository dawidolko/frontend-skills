export function TodoList({ todos }: { todos: { id: string; title: string }[] }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo.title}</li>
      ))}
      {todos.map(({ title }, i) => <li key={`row-${i}`}>{title}</li>)}
    </ul>
  )
}
