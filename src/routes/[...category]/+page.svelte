<script lang="ts">
	import type { PageProps } from './$types';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostsList from '$lib/components/PostsList.svelte';

	let { data }: PageProps = $props();
</script>

<h1>{@html data.category.name}</h1>
{#if data.category.description}
	<div>{@html data.category.description}</div>
{/if}

<PostsList posts={data.posts} />

<Pagination currentPage={data.currentPage} totalPages={data.totalPages} />
