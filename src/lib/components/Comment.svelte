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
	const currentDepthStyle = `margin-left: ${Math.min(depth, MAX_VISUAL_DEPTH) * 20}px;`;
</script>

<li style={currentDepthStyle} id="comment-{comment.id}">
	<div>
		<img
			src={comment.author_avatar_urls['48']}
			alt="{comment.author_name} avatar"
			width="40"
			height="40"
			loading="lazy"
		/>
		<div>
			<strong>{@html comment.author_name}</strong>
			<div>{new Date(comment.date).toLocaleString()}</div>
		</div>
	</div>
	<div>
		{@html comment.content.rendered}
	</div>

	{#if comment.children && comment.children.length > 0}
		<ul>
			{#each comment.children as reply (reply.id)}
				<Comment comment={reply} {postId} depth={depth + 1} />
			{/each}
		</ul>
	{/if}
</li>
