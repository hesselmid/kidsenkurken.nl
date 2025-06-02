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

<h1>Archief</h1>

<ul>
	{#each data.posts as post (post.id)}
		<li>
			<h2><a href={new URL(post.link).pathname}>{@html post.title.rendered}</a></h2>
		</li>
	{/each}
</ul>

<Pagination currentPage={data.currentPage} totalPages={data.totalPages} {getPageLink} />
