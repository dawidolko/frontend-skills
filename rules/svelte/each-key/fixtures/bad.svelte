<script>
  let { todos, remove } = $props()
</script>

<ul>
  {#each todos as todo, i (i)}
    <li><label><input type="checkbox" bind:checked={todo.done} /> {todo.title}</label></li>
  {/each}
</ul>

{#each todos as { id, title }}
  <TodoRow {id} {title} onremove={() => remove(id)} />
{/each}
