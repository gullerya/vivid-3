import * as path from 'path';
import { expect, Page, test } from '@playwright/test';
import {extractHTMLBlocksFromReadme, loadComponent, loadTemplate} from '../../visual-tests/visual-tests-utils';

const componentName = 'badge';
test('should show the component', async ({ page }: { page: Page }) => {
	const template = extractHTMLBlocksFromReadme(path.join(__dirname, 'README.md'))
		.reduce((htmlString: string, block: string) => `${htmlString} <div style="margin: 5px;">${block}</div>`, '');

	await loadComponent({
		page,
		componentName,
	});
	await loadTemplate({
		page,
		template,
	});

	const testWrapper = await page.$('#wrapper');

	await page.waitForLoadState('networkidle');

	expect(await testWrapper?.screenshot())
		.toMatchSnapshot(
			'./snapshots/badge.png',
		);
});
