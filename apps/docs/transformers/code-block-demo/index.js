const { JSDOM } = require('jsdom');
const deps = [...require('../../_data/components.json'), ...require('../../_data/designs.json')];

const CBD_CONTAINER = 'cbd-container';
const CBD_DEMO = 'cbd-demo';
const CBD_DETAILS = 'cbd-details';
const CBD_CODE_BLOCK = 'cbd-code-block';

const getNameFromPath = path => path.split('/').at(-2);

module.exports = function (content, outputPath) {
	if (!outputPath.endsWith('.html')) {
		return content;
	}

	const componentName = getNameFromPath(outputPath);
	const currentDeps = deps.filter(c => c.title === componentName);
	const modules = currentDeps?.[0]?.modules.map(getNameFromPath);

	const dom = new JSDOM(content);
	const codeBlocks = dom.window.document.querySelectorAll('pre.preview > code');
	codeBlocks.forEach((codeBlock, index) => renderiFrame(codeBlock, index, modules));
	return dom.serialize();
};

const renderiFrame = (codeBlock, index, modules) => {
	const pre = codeBlock.closest('pre');
	const codeBlockId = `${CBD_CODE_BLOCK}-${index}`;

	const fragment = JSDOM.fragment(`
    <vwc-card elevation="0" class="${CBD_CONTAINER}">
      <iframe data-index="${index}" ${modules ? `data-modules="${modules?.join(',')}"` : ''} class="${CBD_DEMO}" onload=onloadIframe(this) loading="lazy" aria-label="code block preview iframe" slot="main"></iframe>
      <vwc-action-group appearance="ghost" style="direction: rtl;" slot="main">
        <vwc-button aria-label="Show source code" icon="code-line" aria-expanded="false" aria-controls="${codeBlockId}" onclick="codeBlockButtonClick(this)"></vwc-button>
        <vwc-button aria-label="Copy source code" icon="copy-2-line" onclick="codeCopyButtonClick(this)"></vwc-button>
      </vwc-action-group>
      <details class="${CBD_DETAILS}" slot="main">
        <summary></summary>
        <div class="${CBD_CODE_BLOCK}" role="region" id="${codeBlockId}">
		  ${pre.outerHTML}
        </div>
      </details>
    </vwc-card>`);

	pre.replaceWith(fragment);
}
