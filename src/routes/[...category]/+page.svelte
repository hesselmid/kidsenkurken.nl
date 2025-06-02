<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	function getPageLink(pageNumber: number): string {
		const currentUrl = page.url;
		const newSearchParams = new URLSearchParams(currentUrl.searchParams);
		if (pageNumber <= 1) {
			newSearchParams.delete('page');
		} else {
			newSearchParams.set('page', String(pageNumber));
		}
		const queryString = newSearchParams.toString();
		return `${currentUrl.pathname}${queryString ? `?${queryString}` : ''}`;
	}
</script>

<h1>{@html data.category.name}</h1>
{#if data.category.description}
	<div>{@html data.category.description}</div>
{/if}

{#if data.posts.length > 0}
	<ul>
		{#each data.posts as post (post.id)}
			<li>
				<h2><a href={new URL(post.link).pathname}>{@html post.title.rendered}</a></h2>
			</li>
		{/each}
	</ul>

	{#if data.totalPages > 1}
		<nav class="pagination">
			{#if data.currentPage > 1}
				<a href={getPageLink(data.currentPage - 1)} rel="prev">« Previous</a>
			{/if}

			<!-- Simple page number display -->
			<span>Page {data.currentPage} of {data.totalPages}</span>
			<!-- TODO: Add more sophisticated page number links if needed -->
			<!-- Example:
			{#each Array(data.totalPages) as _, i}
				{@const pageNum = i + 1}
				{#if pageNum === data.currentPage}
					<span>{pageNum}</span>
				{:else}
					<a href={getPageLink(pageNum)}>{pageNum}</a>
				{/if}
			{/each}
			-->

			{#if data.currentPage < data.totalPages}
				<a href={getPageLink(data.currentPage + 1)} rel="next">Next »</a>
			{/if}
		</nav>
	{/if}
{:else}
	<p>
		No posts found in this category{data.currentPage > 1 ? ` on page ${data.currentPage}` : ''}.
	</p>
	{#if data.currentPage > 1 && data.totalPages > 0}
		<!-- Check totalPages to avoid link to page 1 if no posts at all -->
		<a href={getPageLink(1)}>Go to first page</a>
	{/if}
{/if}
