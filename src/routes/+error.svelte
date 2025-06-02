<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error {page.status}</title>
</svelte:head>

<h1>{page.status}</h1>
<p>{page.error?.message || 'An unexpected error occurred.'}</p>
<a href="/">Go to Homepage</a>
