window.onload = () => {
	renderSamples();
};

const renderSamples = () => {
	const iframes = document.querySelectorAll('.cbd-demo');
	iframes.forEach(iframe => {
		const deps = new Set([...iframe.dataset.modules.split(','), 'layout']);

		const idoc = iframe.contentDocument;
		idoc.querySelector('html').className = 'vvd-root';
		
		const range = idoc.createRange();

		let headContent = 
			`<link rel="stylesheet" href="/assets/styles/iframe.css">
		 	 <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap">
			 <link rel="stylesheet" href="/assets/styles/core/all.css">`;

		deps.forEach(s => headContent += `<script type="module" src="/assets/modules/components/${s}/index.js"></scr` + `ipt>`)
		
		let fragmentFromCode = range.createContextualFragment(headContent);
		idoc.head.append(fragmentFromCode);

		const codeBlock = document.querySelector(`#cbd-code-block-${iframe.dataset.index}`);
		let wrappedCode = wrapCode(codeBlock.querySelector(':scope > pre.preview').classList, codeBlock.textContent);

		fragmentFromCode = range.createContextualFragment(wrappedCode);
		idoc.body.replaceChildren(fragmentFromCode);
	})
}

const wrapCode = (classList, sampleCode) => {
	if (classList.contains('full')) return sampleCode;
	if (classList.contains('center')) return `<div class="center">${sampleCode}</div>`;
	if (classList.contains('blocks')) return `<vwc-layout gutters="small" column-basis="block">${sampleCode}</vwc-layout>`;
	if (classList.contains('columns')) return `<vwc-layout gutters="small" column-basis="medium">${sampleCode}</vwc-layout>`;
	return `<vwc-layout gutters="small"><div>${sampleCode}</div></vwc-layout>`;
}
