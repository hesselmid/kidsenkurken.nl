import { getCategoryBySlug, getPosts } from '$lib/server/wordpress';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const POSTS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ params, url }) => {
	const slugs = params.category.split('/');
	const categorySlug = slugs[slugs.length - 1];

	const category = await getCategoryBySlug(categorySlug);

	if (!category) {
		error(404, `Category "${categorySlug}" not found.`);
	}

	const pageQueryParam = url.searchParams.get('page');
	let currentPage = 1;
	if (pageQueryParam) {
		const parsedPage = parseInt(pageQueryParam, 10);
		if (!isNaN(parsedPage) && parsedPage > 0) {
			currentPage = parsedPage;
		}
	}

	const { posts, totalPosts, totalPages } = await getPosts({
		categories: category.id,
		per_page: POSTS_PER_PAGE,
		page: currentPage
	});

	// Optional: Redirect if requested page is out of bounds and posts exist
	// if (currentPage > 1 && currentPage > totalPages && totalPages > 0) {
	// 	const targetPage = totalPages > 0 ? totalPages : 1;
	// 	const newSearchParams = new URLSearchParams(url.searchParams);
	// 	newSearchParams.set('page', String(targetPage));
	// 	throw redirect(302, `${url.pathname}?${newSearchParams.toString()}`);
	// }

	return {
		category,
		posts,
		currentPage,
		totalPages,
		totalPosts // For displaying "X of Y posts" if desired
	};
};
