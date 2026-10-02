/** The same markup as `/section`, with no nested layout. */
export default function FlatPage() {
	return (
		<main>
			<h1>Section heading</h1>
			<p style={{ height: "120vh", margin: 0, background: "lightyellow" }}>Intro, taller than the viewport.</p>
			<p style={{ height: "100vh", margin: 0, background: "lightblue" }}>Page content.</p>
		</main>
	);
}
