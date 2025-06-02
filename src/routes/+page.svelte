<script lang="ts">
	import type { PageProps } from './$types';
	import PostsList from '$lib/components/PostsList.svelte';

	let { data }: PageProps = $props();
</script>

<h1>Latest Posts</h1>

<PostsList posts={data.posts} />
