import { getPosts } from '$lib/server/wordpress';
import type { WP_Post } from '$lib/types';
import type { PageServerLoad } from './$types';

export interface SectionConfig {
	name: string;
	id: number | null;
	title: string;
	perPage: number;
}

const HOMEPAGE_SECTIONS_CONFIG: SectionConfig[] = [
	{ name: 'uitgelicht', id: 2480, title: 'Uitgelicht', perPage: 4 },
	{ name: 'nieuw', id: null, title: 'Nieuw', perPage: 4 },
	{ name: 'blogs', id: 2473, title: 'Blogs', perPage: 4 },
	{ name: 'verhalen', id: 1251, title: 'Verhalen', perPage: 4 },
	{ name: 'toffe_ouders', id: 1252, title: 'Toffe Ouders', perPage: 4 },
	{ name: 'artikelen', id: 2455, title: 'Artikelen', perPage: 4 },
	{ name: 'tv', id: 2476, title: 'TV', perPage: 4 }
];

interface HomepageSectionData {
	name: string;
	title: string;
	posts: WP_Post[];
	error?: string;
}

export const load: PageServerLoad = async () => {
	const fetchPromises = HOMEPAGE_SECTIONS_CONFIG.map(async (sectionConfig) => {
		try {
			const params: Record<string, string | number | undefined> = {
				per_page: sectionConfig.perPage
			};

			if (sectionConfig.id) {
				params.categories = sectionConfig.id;
			} else if (sectionConfig.name === 'nieuw') {
				// Default order for 'nieuw' (latest) is usually date desc, handled by getPosts
			} else {
				return {
					name: sectionConfig.name,
					title: sectionConfig.title,
					posts: [],
					error: 'Invalid section configuration (missing ID for non-new section)'
				} as HomepageSectionData;
			}

			const { posts } = await getPosts(params);

			return {
				name: sectionConfig.name,
				title: sectionConfig.title,
				posts: posts
			} as HomepageSectionData;
		} catch (e: any) {
			console.error(`Error fetching section ${sectionConfig.name}:`, e.body?.message || e.message);
			return {
				name: sectionConfig.name,
				title: sectionConfig.title,
				posts: [],
				error: e.body?.message || e.message || `Failed to load posts for ${sectionConfig.title}.`
			} as HomepageSectionData;
		}
	});

	const results = await Promise.allSettled(fetchPromises);

	const sectionsData: Record<string, HomepageSectionData> = {};
	HOMEPAGE_SECTIONS_CONFIG.forEach((sectionConfig, index) => {
		const result = results[index];
		if (result.status === 'fulfilled') {
			sectionsData[sectionConfig.name] = result.value;
		} else {
			console.error(
				`Unexpected settlement error for section ${sectionConfig.name}:`,
				result.reason
			);
			sectionsData[sectionConfig.name] = {
				name: sectionConfig.name,
				title: sectionConfig.title,
				posts: [],
				error: 'An unexpected error occurred loading this section.'
			};
		}
	});

	// setHeaders({
	// 	'Cache-Control': 'public, max-age=300, s-maxage=600'
	// });

	return {
		sections: sectionsData,
		sectionOrder: HOMEPAGE_SECTIONS_CONFIG.map((s) => ({ name: s.name, title: s.title }))
	};
};
