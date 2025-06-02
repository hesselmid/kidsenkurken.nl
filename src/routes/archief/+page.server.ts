import { getPosts } from '$lib/server/wordpress';
import type { PageServerLoad } from './$types';

const POSTS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ url }) => {
	const pageQueryParam = url.searchParams.get('p');
	let currentPage = 1;
	if (pageQueryParam) {
		const parsedPage = parseInt(pageQueryParam, 10);
		if (!isNaN(parsedPage) && parsedPage > 0) {
			currentPage = parsedPage;
		}
	}

	const { posts, totalPosts, totalPages } = await getPosts({
		per_page: POSTS_PER_PAGE,
		page: currentPage
	});

	return {
		posts,
		currentPage,
		totalPages,
		totalPosts
	};
};
