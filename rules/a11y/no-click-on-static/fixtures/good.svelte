<script>
  let { items, open } = $props()
</script>
<ul>
  {#each items as item (item.id)}
    <li><button type="button" onclick={() => open(item)}>{item.name}</button></li>
  {/each}
</ul>
<div role="button" tabindex="0" onclick={toggle} onkeydown={onKey}>Toggle</div>
