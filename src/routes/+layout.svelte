<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<header>
	<nav>
		<a href="/">Home</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer>
	<p>&copy; {new Date().getFullYear()} Kids en Kurken</p>
</footer>
