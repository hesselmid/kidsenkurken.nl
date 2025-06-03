<script lang="ts">
	import type { PageProps } from './$types';
	import Comment from '$lib/components/Comment.svelte';

	let { data }: PageProps = $props();

	const featuredImageUrl = $derived(data.post._embedded?.['wp:featuredmedia']?.[0]?.source_url);
	const authorName = $derived(data.post._embedded?.author?.[0]?.name || 'Unknown Author');
</script>

<article>
	<header>
		<h1>{@html data.post.title.rendered}</h1>
		<p>By: {authorName} on {new Date(data.post.date).toLocaleDateString()}</p>
	</header>

	{#if featuredImageUrl}
		<img
			src={featuredImageUrl}
			alt={data.post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || data.post.title.rendered}
		/>
	{/if}

	<div>
		{@html data.post.content.rendered}
	</div>
</article>

<section id="comments-section">
	<h2>Comments</h2>

	{#await data.comments}
		<p>Loading comments...</p>
	{:then commentTree}
		{#if commentTree.length > 0}
			<ul>
				{#each commentTree as topLevelComment (topLevelComment.id)}
					<Comment comment={topLevelComment} postId={data.post.id} depth={0} />
				{/each}
			</ul>
		{:else}
			<p>No comments yet.</p>
		{/if}
	{:catch errorVal}
		<p>Error loading comments: {errorVal.message}</p>
	{/await}
</section>
