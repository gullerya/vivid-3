import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testMatch: 'src/**/*.pwspec.ts',
	timeout: 0,
	// if you run `npx http-server -s` at the root of the repo, it will be reused
	// otherwise, it will be launched here
	webServer: {
		command: 'npx http-server -s',
		cwd: '../..',
		url: 'http://127.0.0.1:8080/scripts/visual-tests/index.html',
		timeout: 10_000,
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{
			name: 'Chromium',
			use: {
				browserName: 'chromium',
				// headless: false
			},
		},
	]
};
export default config;
