import { getPosts } from '$lib/server/wordpress';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { posts } = await getPosts({ per_page: 10, orderby: 'date', order: 'desc' });

	return {
		posts
	};
};
