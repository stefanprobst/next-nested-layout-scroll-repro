/**
 * A section whose pages share a header: the title and an intro taller than the viewport. Only the pages' content goes
 * in `{children}`, as with tabs that switch between sibling routes.
 */
export default function SectionLayout({ children }) {
	return (
		<main>
			<h1>Section heading</h1>
			<p style={{ height: "120vh", margin: 0, background: "lightyellow" }}>Intro, taller than the viewport.</p>
			{children}
		</main>
	);
}
