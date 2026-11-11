<script>
  import { page } from '$app/stores'
</script>

<a href="/docs" aria-current={$page.url.pathname === '/docs' ? 'page' : undefined}>Docs</a>
