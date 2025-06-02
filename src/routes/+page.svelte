<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Latest Posts</h1>

<ul>
	{#each data.posts as post (post.id)}
		<li>
			<h2><a href={new URL(post.link).pathname}>{@html post.title.rendered}</a></h2>
		</li>
	{/each}
</ul>
