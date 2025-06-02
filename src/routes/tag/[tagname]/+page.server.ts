import { getTagBySlug, getPosts } from '$lib/server/wordpress';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const POSTS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ params, url }) => {
	const tag = await getTagBySlug(params.tagname);

	if (!tag) {
		error(404, `Tag "${params.tagname}" not found.`);
	}

	const pageQueryParam = url.searchParams.get('p');
	let currentPage = 1;
	if (pageQueryParam) {
		const parsedPage = parseInt(pageQueryParam, 10);
		if (!isNaN(parsedPage) && parsedPage > 0) {
			currentPage = parsedPage;
		}
	}

	const { posts, totalPosts, totalPages } = await getPosts({
		tags: tag.id,
		per_page: POSTS_PER_PAGE,
		page: currentPage
	});

	return {
		tag,
		posts,
		currentPage,
		totalPages,
		totalPosts
	};
};
