// Starts `next start`, soft-navigates from `/` (scrolled to the top) to `/section` and to `/flat`, and records where the
// new page ends up scrolled. Both render the same markup; `/section` puts its heading and intro in a nested layout.
// Set `DEV=1` to run against `next dev` instead.

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium, firefox, webkit } from "playwright";

const port = 3202;
const base = `http://localhost:${port}`;

const links = ["Section", "Flat"];

const command = process.env.DEV === "1" ? "dev" : "start";
const server = spawn("node_modules/.bin/next", [command, "-p", String(port)], { stdio: "ignore" });

try {
	await waitForServer();

	for (const browserType of [chromium, firefox, webkit]) {
		const browser = await browserType.launch();
		console.log(`\n## ${browserType.name()} ${browser.version()}\n`);
		console.log("| link | `scrollY` after navigation | `<h1>` top | expected |");
		console.log("| --- | --- | --- | --- |");

		for (const link of links) {
			const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
			await page.goto(base);
			// Let prefetches finish.
			await sleep(1000);
			await page.getByRole("link", { name: link, exact: true }).click();
			await page.getByRole("heading", { level: 1, name: "Section heading" }).waitFor();
			await sleep(1000);
			const { scrollY, headingTop } = await page.evaluate(() => ({
				scrollY: Math.round(window.scrollY),
				headingTop: Math.round(document.querySelector("h1").getBoundingClientRect().top),
			}));
			const verdict = scrollY === 0 ? "" : " ❌";
			console.log(`| ${link} | ${scrollY}${verdict} | ${headingTop} | 0 |`);
			await page.close();
		}

		await browser.close();
	}
} finally {
	server.kill();
}

async function waitForServer() {
	for (let attempt = 0; attempt < 60; attempt++) {
		try {
			await fetch(base);
			return;
		} catch {
			await sleep(500);
		}
	}
	throw new Error("next start did not come up");
}
