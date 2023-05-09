import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
	loadComponents,
	loadTemplate,
} from '../../visual-tests/visual-tests-utils.js';

const components = ['data-grid'];

export const gridTestFunction = async ({ page }: { page: Page }) => {

	const template = `<div style="margin: 5px;">
			<vwc-data-grid></vwc-data-grid>
	</div>`;

	await loadComponents({
		page,
		components,
	});
	await loadTemplate({
		page,
		template,
	});

	const testWrapper = await page.$('#wrapper');

	await page.waitForLoadState('networkidle');

	await page.addScriptTag({content: `
	const grid = document.querySelector('vwc-data-grid');
	grid.columnDefinitions = [
		{columnDataKey: 'data1', title: 'Data 1'},
		{columnDataKey: 'data2', title: 'Data 2'},
	];
	grid.rowsData = [
		{data1: 'data11', data2: 'data12'},
		{data1: 'data21', data2: 'data22'},
	];
	`});

	const text = await page.locator('vwc-data-grid-cell:has-text("data22")');
	await text.isVisible();

	expect(await testWrapper?.screenshot()).toMatchSnapshot(
		'./snapshots/data-grid.png',
		{ maxDiffPixelRatio: 0.02 }
	);
};

test('should show the component', gridTestFunction);
