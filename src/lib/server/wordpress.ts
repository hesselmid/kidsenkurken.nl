import { PUBLIC_WP_API_URL } from '$env/static/public';
import type {
	WP_Post,
	WP_Category,
	WP_Tag,
	WP_Comment,
	WP_Comment_With_Children,
	PaginatedPostsResponse
} from '$lib/types';
import { error } from '@sveltejs/kit';

const BASE_URL = PUBLIC_WP_API_URL;

async function fetchAPI<T>(path: string, requestOptions: RequestInit = {}): Promise<T> {
	const fullPath = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
	const response = await fetch(fullPath, requestOptions);

	if (!response.ok) {
		let message = `API request to ${path} failed with status ${response.status}`;
		try {
			const errorData = await response.json();
			if (
				errorData &&
				typeof errorData === 'object' &&
				'message' in errorData &&
				typeof errorData.message === 'string'
			) {
				message = errorData.message;
			}
		} catch (e) {
			console.error(`Failed to parse error response from ${path}:`, e);
		}
		error(response.status, message);
	}
	return response.json() as Promise<T>;
}

export async function getPosts(
	params: Record<string, string | number | undefined> = {}
): Promise<PaginatedPostsResponse> {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			query.set(key, String(value));
		}
	}
	query.set('_embed', 'author,wp:featuredmedia,wp:term');

	const path = `/wp/v2/posts?${query.toString()}`;
	const fullPath = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

	const response = await fetch(fullPath);

	if (!response.ok) {
		let message = `API request to ${path} failed with status ${response.status}`;
		try {
			const errorData = await response.json();
			if (
				errorData &&
				typeof errorData === 'object' &&
				'message' in errorData &&
				typeof errorData.message === 'string'
			) {
				message = errorData.message;
			}
		} catch (e) {
			console.error(`Failed to parse error response from ${path}:`, e);
		}
		error(response.status, message);
	}

	const posts = (await response.json()) as WP_Post[];
	const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0', 10);
	const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

	return { posts, totalPosts, totalPages };
}

export async function getPostByDateAndSlug(
	year: string,
	month: string,
	day: string,
	slug: string
): Promise<WP_Post | null> {
	const y = parseInt(year, 10);
	const m = parseInt(month, 10);
	const d = parseInt(day, 10);

	if (isNaN(y) || isNaN(m) || isNaN(d)) {
		error(400, 'Invalid date parameters provided to getPostByDateAndSlug.');
	}

	const afterDateTime = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
	const beforeDateTime = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
	beforeDateTime.setUTCDate(beforeDateTime.getUTCDate() + 1);

	const apiParams: Record<string, string | number | undefined> = {
		slug: slug,
		after: afterDateTime.toISOString(),
		before: beforeDateTime.toISOString(),
		per_page: 1,
		status: 'publish'
	};

	const paginatedResult = await getPosts(apiParams);
	return paginatedResult.posts[0] || null;
}

export async function getCategories(
	params: Record<string, string | number | undefined> = {}
): Promise<WP_Category[]> {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			query.set(key, String(value));
		}
	}
	return fetchAPI<WP_Category[]>(`/wp/v2/categories?${query.toString()}`);
}

export async function getCategoryBySlug(slug: string): Promise<WP_Category | null> {
	const categories = await getCategories({ slug, per_page: 1 });
	return categories[0] || null;
}

export async function getTags(
	params: Record<string, string | number | undefined> = {}
): Promise<WP_Tag[]> {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			query.set(key, String(value));
		}
	}
	return fetchAPI<WP_Tag[]>(`/wp/v2/tags?${query.toString()}`);
}

export async function getTagBySlug(slug: string): Promise<WP_Tag | null> {
	const tags = await getTags({ slug, per_page: 1 });
	return tags[0] || null;
}

export async function getCommentsForPost(
	postId: number,
	page: number = 1,
	perPage: number = 100
): Promise<{ comments: WP_Comment[]; totalComments: number; totalPages: number }> {
	const query = new URLSearchParams({
		post: String(postId),
		per_page: String(perPage),
		page: String(page),
		orderby: 'date_gmt',
		order: 'asc',
		status: 'approve',
		type: 'comment'
	});

	const response = await fetch(`${BASE_URL}/wp/v2/comments?${query.toString()}`);

	if (!response.ok) {
		let message = `API request to /wp/v2/comments failed with status ${response.status}`;
		try {
			const errorData = await response.json();
			if (
				errorData &&
				typeof errorData === 'object' &&
				'message' in errorData &&
				typeof errorData.message === 'string'
			) {
				message = errorData.message;
			}
		} catch (e) {
			console.error(`Failed to parse error response from /wp/v2/comments:`, e);
		}
		error(response.status, message);
	}

	const comments = (await response.json()) as WP_Comment[];
	const totalComments = parseInt(response.headers.get('X-WP-Total') || '0', 10);
	const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

	return { comments, totalComments, totalPages };
}

export async function getAllCommentsForPost(postId: number): Promise<WP_Comment[]> {
	let allComments: WP_Comment[] = [];
	let currentPage = 1;
	const perPage = 100;
	let totalPages = 1;

	// Wait for 1 second
	await new Promise((resolve) => setTimeout(resolve, 1000));

	do {
		try {
			const { comments, totalPages: fetchedTotalPages } = await getCommentsForPost(
				postId,
				currentPage,
				perPage
			);
			if (comments && comments.length > 0) {
				allComments = allComments.concat(comments);
			}
			totalPages = fetchedTotalPages;
			currentPage++;
		} catch (e) {
			console.error(`Error fetching page ${currentPage} of comments for post ${postId}:`, e);
			break;
		}
	} while (currentPage <= totalPages && totalPages > 0);

	return allComments;
}

export function buildCommentTree(comments: WP_Comment[]): WP_Comment_With_Children[] {
	const commentsById: Record<number, WP_Comment_With_Children> = {};
	const rootComments: WP_Comment_With_Children[] = [];

	for (const comment of comments) {
		commentsById[comment.id] = { ...comment, children: [] };
	}

	for (const commentId in commentsById) {
		const comment = commentsById[commentId];
		if (comment.parent === 0) {
			rootComments.push(comment);
		} else {
			const parentComment = commentsById[comment.parent];
			if (parentComment) {
				parentComment.children.push(comment);
			} else {
				console.warn(`Orphaned comment ${comment.id} (parent ${comment.parent}) not found.`);
			}
		}
	}
	return rootComments;
}
