<script lang="ts">
	import type { PageProps } from './$types';
	import PostsList from '$lib/components/PostsList.svelte';

	let { data }: PageProps = $props();
</script>

<h1>Kids en Kurken</h1>

{#if data.sectionOrder && data.sectionOrder.length > 0}
	{#each data.sectionOrder as sectionMeta (sectionMeta.name)}
		{@const currentSectionData = data.sections[sectionMeta.name]}
		{#if currentSectionData}
			<section aria-labelledby="section-title-{sectionMeta.name}">
				<h2 id="section-title-{sectionMeta.name}">{sectionMeta.title}</h2>

				{#if currentSectionData.error}
					<p>
						Er is iets misgegaan bij het laden van dit onderdeel: {currentSectionData.error}
					</p>
				{:else if currentSectionData.posts && currentSectionData.posts.length > 0}
					<PostsList posts={currentSectionData.posts} headingLevel={3} />
				{:else}
					<p>Er zijn momenteel geen berichten in "{sectionMeta.title}".</p>
				{/if}
			</section>
		{/if}
	{/each}
{:else}
	<p>De inhoud van de homepage wordt geladen of is momenteel niet beschikbaar.</p>
{/if}
