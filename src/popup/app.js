const template = document.querySelector('template');
const container = document.querySelector('#container');

addEventListener("load", async (e) => {
	const response = await browser.storage.sync.get('filters');
	const data = await response.filters;
	data.forEach(row => {
		const node = template.content.cloneNode(true);

		node.querySelector('input[name="domain"]').value = row.domain;
		node.querySelector('input[name="enabled"]').checked = row.enabled;

		container.appendChild(node);
	});
});

/*==================================================
	Adds addEventListener when new buttons and checkboxes gets added
==================================================*/
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const switches = node.querySelectorAll('.switch input[type="checkbox"]');
					if (switches.length > 0) {
						switches.forEach((element) => {
							element.addEventListener('keydown', (e) => {
								if (e.key === 'Enter'){
									e.preventDefault();
									element.click();
								}
							});
						});
					}

					if (node.tagName === 'BUTTON' || node.querySelector('button')) {
						const buttons = node.tagName === 'BUTTON'
							? [node]
							: node.querySelectorAll('button');

						buttons.forEach((button) => {
							button.addEventListener('click', () => buttonEvent(button));
						});
					}
				}
			});
		}
	});
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

/*==================================================
	Init
==================================================*/
initSwitches()
initButtons()

function initSwitches() {
	document.querySelectorAll('.switch input[type="checkbox"]').forEach((element) => {
		element.addEventListener('keydown', (e) => {
			if(e.key === 'Enter'){
				e.preventDefault();
				element.click();
			}
		});
	})
}

function initButtons() {
	document.querySelectorAll('button').forEach((element) => {
		element.addEventListener('click', () => buttonEvent(element));
	})
}

/*==================================================
	Button actions
==================================================*/
async function buttonEvent(element) {
	switch (element.name) {
		case 'add':
			container.appendChild(template.content.cloneNode(true));
			break;
		case 'del':
			element.parentNode.parentNode.remove();
			break;
		case 'save':
			const domains = document.querySelectorAll('input[name="domain"]');
			const enabled = document.querySelectorAll('input[name="enabled"]');

			let data = [];
			domains.forEach((domain, i) => {
				data.push({
					domain: domain.value,
					enabled: enabled[i].checked
				});
			});

			await browser.storage.sync.set({filters: data});
			break;
	}
}