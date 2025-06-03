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

	function getRelativeTime(dateString: string): string {
		const now = new Date();
		const commentDate = new Date(dateString);
		const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return 'now';
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes}m ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours}h ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 30) {
			return `${diffInDays}d ago`;
		}

		const diffInMonths = Math.floor(diffInDays / 30);
		if (diffInMonths < 12) {
			return `${diffInMonths}mo ago`;
		}

		const diffInYears = Math.floor(diffInMonths / 12);
		return `${diffInYears}y ago`;
	}
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
			<div>{getRelativeTime(comment.date)}</div>
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
