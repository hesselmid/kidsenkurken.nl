<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		getPageLink: (pageNumber: number) => string;
		pageLinkNeighbours?: number;
	}

	let { currentPage, totalPages, getPageLink, pageLinkNeighbours = 2 }: Props = $props();

	const pageNumbers = $derived.by((): (number | '...')[] => {
		if (totalPages <= 1) {
			return [];
		}

		const pages: (number | '...')[] = [];
		const linksWindowSize = pageLinkNeighbours * 2 + 1;

		if (totalPages <= linksWindowSize + 2) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			let windowStart = Math.max(2, currentPage - pageLinkNeighbours);
			let windowEnd = Math.min(totalPages - 1, currentPage + pageLinkNeighbours);

			const currentWindowSize = windowEnd - windowStart + 1;

			if (currentWindowSize < linksWindowSize - 2) {
				if (currentPage <= pageLinkNeighbours + 1) {
					windowEnd = Math.min(totalPages - 1, linksWindowSize - 1);
				} else if (currentPage >= totalPages - pageLinkNeighbours) {
					windowStart = Math.max(2, totalPages - (linksWindowSize - 1));
				}
			}

			if (windowStart > 2) {
				pages.push('...');
			}

			for (let i = windowStart; i <= windowEnd; i++) {
				pages.push(i);
			}

			if (windowEnd < totalPages - 1) {
				pages.push('...');
			}

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

			{#each pageNumbers as pageNum (typeof pageNum === 'number' ? pageNum : Math.random())}
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
