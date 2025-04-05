browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.url) {
		try {
			const response = await browser.storage.sync.get('filters');
			const filters = response.filters || [];

			let urlToRemove = ''
			filters.forEach((filter) => {
				if (tab.url.includes(filter.domain) && filter.enabled === true) {
					urlToRemove = filter.domain;
					return;
				}
			});

			if (urlToRemove) {
				const searchResults = await browser.history.search({
					text: urlToRemove,
					startTime: 0,
					maxResults: Number.MAX_SAFE_INTEGER
				});

				let removedCount = 0;
				for (const item of searchResults) {
					if (item.url.includes(urlToRemove)) {
						await browser.history.deleteUrl({ url: item.url });
						removedCount++;
					}
				}
			}
		} catch (error) {
			console.error('Error in history filtering:', error);
		}
	}
});