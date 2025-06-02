<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostsList from '$lib/components/PostsList.svelte';

	let { data }: PageProps = $props();

	function getPageLink(pageNumber: number): string {
		const currentUrl = page.url;
		const newSearchParams = new URLSearchParams(currentUrl.searchParams);
		if (pageNumber <= 1) {
			newSearchParams.delete('p');
		} else {
			newSearchParams.set('p', String(pageNumber));
		}
		const queryString = newSearchParams.toString();
		return `${currentUrl.pathname}${queryString ? `?${queryString}` : ''}`;
	}
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

<Pagination currentPage={data.currentPage} totalPages={data.totalPages} {getPageLink} />
