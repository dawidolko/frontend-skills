<script>
  import { fade } from 'svelte/transition'
  let { todos, tags } = $props()
</script>

<ul>
  {#each todos as todo (todo.id)}
    <li transition:fade><label><input type="checkbox" bind:checked={todo.done} /> {todo.title}</label></li>
  {/each}
</ul>

<p>
  {#each tags as tag, i}
    {i > 0 ? ', ' : ''}<span class="tag">{tag}</span>
  {/each}
</p>

{#each Array(3) as _, i}
  <Skeleton line={i} />
{/each}

{#each [1, 2, 3] as step}
  <Step {step} />
{/each}

{#each { length: 2 }, i}
  <hr />
{/each}
