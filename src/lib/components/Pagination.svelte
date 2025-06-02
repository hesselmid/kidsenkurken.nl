<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		currentPage: number;
		totalPages: number;
	}

	let { currentPage, totalPages }: Props = $props();

	const PAGE_LINK_NEIGHBOURS = 2; // Number of page links to show on either side of current page
	const PAGE_PARAM_NAME = 'p'; // URL query parameter for page number

	/**
	 * Generates the URL for a specific page number.
	 */
	function getPageLink(pageNumber: number): string {
		const currentUrl = page.url;
		const newSearchParams = new URLSearchParams(currentUrl.searchParams);

		if (pageNumber <= 1) {
			newSearchParams.delete(PAGE_PARAM_NAME);
		} else {
			newSearchParams.set(PAGE_PARAM_NAME, String(pageNumber));
		}

		const queryString = newSearchParams.toString();
		return `${currentUrl.pathname}${queryString ? `?${queryString}` : ''}`;
	}

	/**
	 * Calculates the array of page numbers and ellipses to display.
	 * Logic:
	 * - If few pages, show all.
	 * - Otherwise, show first page, last page, and a window around the current page,
	 *   with ellipses (...) for gaps.
	 */
	const pageNumbers = $derived.by((): (number | '...')[] => {
		if (totalPages <= 1) {
			return []; // No pagination needed for 0 or 1 page
		}

		const pages: (number | '...')[] = [];

		// The total number of direct page links we aim to show (e.g., 2_1_2 -> 5 links)
		const linksWindowSize = PAGE_LINK_NEIGHBOURS * 2 + 1; // Always 5 in this config

		// Threshold for showing all pages vs using ellipses
		// (linksWindowSize + first page + last page, if they are distinct from the window)
		const maxPagesWithoutEllipsis = linksWindowSize + 2; // Always 7 in this config

		if (totalPages <= maxPagesWithoutEllipsis) {
			// Show all page numbers if total pages is 7 or less
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// More than 7 pages, so ellipses will be involved

			// Always add the first page
			pages.push(1);

			// Determine the start and end of the window around the current page
			// (e.g., if currentPage=5, neighbours=2, initial window is [3,4,5,6,7])
			let windowStart = Math.max(2, currentPage - PAGE_LINK_NEIGHBOURS);
			let windowEnd = Math.min(totalPages - 1, currentPage + PAGE_LINK_NEIGHBOURS);

			// The actual number of items in the calculated window
			const currentWindowItemCount = windowEnd - windowStart + 1;

			// If the window is smaller than desired due to being near an edge,
			// try to expand it to fill the target `linksWindowSize` (5 items).
			// Example: currentPage=2, neighbours=2. Initial window [2,3,4]. Item count = 3.
			// linksWindowSize - 2 = 3. 3 is not < 3.
			// Example: currentPage=1, neighbours=2. Initial window [2,3]. Item count = 2.
			// 2 < 3 is true.
			if (currentWindowItemCount < linksWindowSize - 2) {
				// (5 - 2 = 3 items means no adjustment needed)
				if (currentPage <= PAGE_LINK_NEIGHBOURS + 1) {
					// currentPage is 1, 2, or 3
					// Near the start: expand window to the right
					windowEnd = Math.min(totalPages - 1, linksWindowSize - 1); // Show up to page 4 (or totalPages-1)
				} else if (currentPage >= totalPages - PAGE_LINK_NEIGHBOURS) {
					// currentPage is near the end
					// Near the end: expand window to the left
					windowStart = Math.max(2, totalPages - (linksWindowSize - 1)); // Show from page (totalPages-4) (or 2)
				}
			}

			// Add leading ellipsis if window doesn't start immediately after page 1
			if (windowStart > 2) {
				pages.push('...');
			}

			// Add page numbers within the (potentially adjusted) window
			for (let i = windowStart; i <= windowEnd; i++) {
				pages.push(i);
			}

			// Add trailing ellipsis if window doesn't end immediately before the last page
			if (windowEnd < totalPages - 1) {
				pages.push('...');
			}

			// Always add the last page
			pages.push(totalPages);
		}
		return pages;
	});
</script>

{#if totalPages > 1}
	<nav aria-label="Pagination">
		<ul>
			<li>
				{#if currentPage > 1}
					<a href={getPageLink(currentPage - 1)} rel="prev" aria-label="Previous page">« Vorige</a>
				{:else}
					<span class="disabled" aria-disabled="true" aria-label="Previous page (disabled)"
						>« Vorige</span
					>
				{/if}
			</li>

			{#each pageNumbers as pageNum (typeof pageNum === 'number' ? pageNum : `ellipsis-${Math.random()}`)}
				<li>
					{#if typeof pageNum === 'number'}
						{#if pageNum === currentPage}
							<span aria-current="page" aria-label="Page {pageNum}">{pageNum}</span>
						{:else}
							<a href={getPageLink(pageNum)} aria-label="Go to page {pageNum}">{pageNum}</a>
						{/if}
					{:else}
						<span class="ellipsis">{pageNum}</span>
					{/if}
				</li>
			{/each}

			<li>
				{#if currentPage < totalPages}
					<a href={getPageLink(currentPage + 1)} rel="next" aria-label="Next page">Volgende »</a>
				{:else}
					<span class="disabled" aria-disabled="true" aria-label="Next page (disabled)"
						>Volgende »</span
					>
				{/if}
			</li>
		</ul>
	</nav>
{/if}
