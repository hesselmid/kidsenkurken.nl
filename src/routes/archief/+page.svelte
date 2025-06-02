<script lang="ts">
	import type { PageProps } from './$types';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostsList from '$lib/components/PostsList.svelte';

	let { data }: PageProps = $props();
</script>

<h1>Archief</h1>

<PostsList posts={data.posts} />

<Pagination currentPage={data.currentPage} totalPages={data.totalPages} />
