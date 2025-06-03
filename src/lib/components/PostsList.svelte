<script lang="ts">
	import type { WP_Post } from '$lib/types';

	interface Props {
		posts: WP_Post[];
		headingLevel?: 2 | 3;
	}
	let { posts, headingLevel = 2 }: Props = $props();

	const HeadingTag = `h${headingLevel}`;
</script>

<ul>
	{#each posts as post (post.id)}
		<!-- {@const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
		{@const altText = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text} -->
		<li>
			<article>
				<!-- {#if featuredImage}
					<img src={featuredImage} alt={altText} width="400" height="400" />
				{/if} -->
				<svelte:element this={HeadingTag}>
					<a href={new URL(post.link).pathname}>{@html post.title.rendered}</a>
				</svelte:element>
			</article>
		</li>
	{/each}
</ul>
