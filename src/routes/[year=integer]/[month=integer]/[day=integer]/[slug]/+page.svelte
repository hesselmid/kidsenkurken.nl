<script lang="ts">
	import type { PageProps } from './$types';
	import Comment from '$lib/components/Comment.svelte';
	let { data }: PageProps = $props();
	const featuredImageUrl = $derived(data.post._embedded?.['wp:featuredmedia']?.[0]?.source_url);
	const authorName = $derived(data.post._embedded?.author?.[0]?.name || 'Unknown Author');
</script>

<article class="mx-auto max-w-2xl px-6 py-12 text-base">
	<header class="mb-12 text-center">
		<h1 class="mb-6 font-serif text-4xl leading-tight text-stone-900">
			{@html data.post.title.rendered}
		</h1>
		<p class="text-sm tracking-wider text-stone-500 uppercase">
			By {authorName} on {new Date(data.post.date).toLocaleDateString()}
		</p>
	</header>

	{#if featuredImageUrl}
		<img
			src={featuredImageUrl}
			alt={data.post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || data.post.title.rendered}
			class="mb-12 h-80 w-full object-cover"
		/>
	{/if}

	<div
		class="prose prose-stone prose-headings:font-serif prose-headings:text-stone-900 prose-p:text-stone-700 prose-p:leading-relaxed prose-a:text-stone-900 prose-a:underline prose-a:decoration-1 prose-a:underline-offset-2 hover:prose-a:decoration-2 max-w-none text-base"
	>
		{@html data.post.content.rendered}
	</div>
</article>

<section id="comments-section" class="mx-auto mt-12 max-w-2xl border-t border-stone-300 px-6 py-12">
	<h2 class="mb-8 text-center font-serif text-2xl text-stone-900">Comments</h2>

	{#await data.comments}
		<p class="py-8 text-center text-stone-500">Loading comments...</p>
	{:then commentTree}
		{#if commentTree.length > 0}
			<ul class="space-y-8">
				{#each commentTree as topLevelComment (topLevelComment.id)}
					<Comment comment={topLevelComment} postId={data.post.id} depth={0} />
				{/each}
			</ul>
		{:else}
			<p class="py-8 text-center text-stone-500">No comments yet.</p>
		{/if}
	{:catch errorVal}
		<p class="py-8 text-center text-stone-600">Error loading comments: {errorVal.message}</p>
	{/await}
</section>
