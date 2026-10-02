import Link from "next/link";

export default function Home() {
	return (
		<main>
			<h1>Home</h1>
			<ul>
				<li><Link href="/section">Section</Link> (header and intro in a nested layout)</li>
				<li><Link href="/flat">Flat</Link> (the same markup, all in the page)</li>
			</ul>
		</main>
	);
}
