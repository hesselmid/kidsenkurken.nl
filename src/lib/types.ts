// WordPress Embedded Term (used in _embedded.wp:term)
export interface WP_Embedded_Term {
	id: number;
	name: string;
	slug: string;
	taxonomy: string;
	link: string;
}

// WordPress Post
export interface WP_Post {
	id: number;
	date: string;
	date_gmt: string;
	slug: string;
	status: string;
	type: string;
	link: string;
	title: {
		rendered: string;
	};
	content: {
		rendered: string;
		protected: boolean;
	};
	excerpt: {
		rendered: string;
		protected: boolean;
	};
	author: number;
	featured_media: number;
	categories: number[];
	tags: number[];
	_embedded?: {
		author?: Array<{ id: number; name: string; link: string; slug: string }>;
		'wp:featuredmedia'?: Array<{
			id: number;
			source_url: string;
			alt_text: string;
			media_details?: { width: number; height: number };
		}>;
		'wp:term'?: WP_Embedded_Term[][];
	};
}

// WordPress Category
export interface WP_Category {
	id: number;
	count: number;
	description: string;
	link: string;
	name: string;
	slug: string;
	taxonomy: string;
	parent: number;
	meta: Array<Record<string, unknown>>;
}

// WordPress Tag
export interface WP_Tag {
	id: number;
	count: number;
	description: string;
	link: string;
	name: string;
	slug: string;
	taxonomy: string;
	meta: Array<Record<string, unknown>>;
}

// WordPress Comment Links
export interface WP_Comment_Link_Item {
	href: string;
	embeddable?: boolean;
	taxonomy?: string;
	name?: string;
}

export interface WP_Comment_Links {
	self: WP_Comment_Link_Item[];
	collection: WP_Comment_Link_Item[];
	up?: WP_Comment_Link_Item[];
	author?: WP_Comment_Link_Item[];
	'in-reply-to'?: WP_Comment_Link_Item[];
}

// WordPress Comment
export interface WP_Comment {
	id: number;
	post: number;
	parent: number;
	author: number;
	author_name: string;
	author_url: string;
	date: string;
	date_gmt: string;
	content: {
		rendered: string;
	};
	link: string;
	status: string;
	type: string;
	author_avatar_urls: {
		'24': string;
		'48': string;
		'96': string;
	};
	meta: Array<Record<string, unknown>>;
	_links: WP_Comment_Links;
	children?: WP_Comment_With_Children[];
}

// Helper for comment tree building
export interface WP_Comment_With_Children extends WP_Comment {
	children: WP_Comment_With_Children[];
}

// For paginated posts responses
export interface PaginatedPostsResponse {
	posts: WP_Post[];
	totalPosts: number;
	totalPages: number;
}
