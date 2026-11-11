export function TodoList({ todos }: { todos: { id: string; title: string }[] }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={todo.id} data-position={index}>
          {todo.title}
        </li>
      ))}
    </ul>
  )
}
