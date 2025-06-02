<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import Pagination from '$lib/components/Pagination.svelte';

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

{#if data.posts.length > 0}
	<ul>
		{#each data.posts as post (post.id)}
			<li>
				<h3><a href={new URL(post.link).pathname}>{@html post.title.rendered}</a></h3>
			</li>
		{/each}
	</ul>

	<Pagination currentPage={data.currentPage} totalPages={data.totalPages} {getPageLink} />
{:else}
	<p>No posts found with this tag{data.currentPage > 1 ? ` on page ${data.currentPage}` : ''}.</p>
	{#if data.currentPage > 1 && data.totalPages > 0}
		<a href={getPageLink(1)}>Go to first page</a>
	{/if}
{/if}
