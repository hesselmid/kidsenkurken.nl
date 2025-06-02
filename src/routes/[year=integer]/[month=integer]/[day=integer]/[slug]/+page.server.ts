import {
	getPostByDateAndSlug,
	getAllCommentsForPost,
	buildCommentTree
} from '$lib/server/wordpress';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { WP_Comment_With_Children } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostByDateAndSlug(params.year, params.month, params.day, params.slug);

	if (!post) {
		error(404, 'Post not found for the given date and slug.');
	}

	const postDate = new Date(post.date_gmt);
	if (
		postDate.getUTCFullYear() !== parseInt(params.year, 10) ||
		postDate.getUTCMonth() + 1 !== parseInt(params.month, 10) ||
		postDate.getUTCDate() !== parseInt(params.day, 10)
	) {
		console.warn(
			`Date in URL (${params.year}-${params.month}-${params.day}) implies a different UTC day than post's GMT date (${post.date_gmt}). Content served based on slug match for the given URL date parts.`
		);
	}

	const commentsPromise: Promise<WP_Comment_With_Children[]> = getAllCommentsForPost(post.id)
		.then((flatComments) => buildCommentTree(flatComments))
		.catch((err) => {
			console.error(`Failed to load or build comment tree for post ${post.id}:`, err);
			return [];
		});

	return {
		post,
		comments: commentsPromise
	};
};
