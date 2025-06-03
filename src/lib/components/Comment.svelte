<script lang="ts">
	import type { WP_Comment_With_Children } from '$lib/types';
	import Comment from './Comment.svelte';

	interface Props {
		comment: WP_Comment_With_Children;
		postId: number;
		depth?: number;
	}

	let { comment, postId, depth = 0 }: Props = $props();

	const MAX_VISUAL_DEPTH = 4;
	const indentLevel = Math.min(depth, MAX_VISUAL_DEPTH);
</script>

<li
	class="{depth > 0 ? 'ml-8 border-l border-stone-300 pl-6' : ''} mb-6 text-base"
	id="comment-{comment.id}"
>
	<img
		src={comment.author_avatar_urls['48']}
		alt="{comment.author_name} avatar"
		width="32"
		height="32"
		loading="lazy"
		class="float-left mt-1 mr-4 rounded-full"
	/>
	<strong class="text-base font-semibold text-stone-900">{@html comment.author_name}</strong>
	<time class="ml-3 text-sm text-stone-500">{new Date(comment.date).toLocaleString()}</time>

	<div
		class="prose prose-stone prose-p:text-stone-700 prose-p:leading-relaxed prose-a:text-stone-900 prose-a:underline prose-a:decoration-1 prose-a:underline-offset-2 hover:prose-a:decoration-2 mt-3 max-w-none text-base"
	>
		{@html comment.content.rendered}
	</div>

	{#if comment.children && comment.children.length > 0}
		<ul class="clear-both mt-6">
			{#each comment.children as reply (reply.id)}
				<Comment comment={reply} {postId} depth={depth + 1} />
			{/each}
		</ul>
	{/if}
</li>
