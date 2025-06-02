<script lang="ts">
	import type { PageProps } from './$types';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostsList from '$lib/components/PostsList.svelte';

	let { data }: PageProps = $props();
</script>

<h1>Tag: {@html data.tag.name}</h1>
{#if data.tag.description}
	<div>{@html data.tag.description}</div>
{/if}

<h2>
	Posts with this tag
	{#if data.totalPages > 1}(Page {data.currentPage} of {data.totalPages}){/if}
</h2>

<PostsList posts={data.posts} headingLevel={3} />

<Pagination currentPage={data.currentPage} totalPages={data.totalPages} />
