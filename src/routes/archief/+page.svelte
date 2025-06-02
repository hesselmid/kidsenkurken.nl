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

<h1>Archief</h1>

<PostsList posts={data.posts} />

<Pagination currentPage={data.currentPage} totalPages={data.totalPages} {getPageLink} />
