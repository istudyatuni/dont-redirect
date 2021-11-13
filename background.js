const URLS = {
	'4pda.to': { type: 'search', key: 'u' },
	'l.instagram.com': { type: 'search', key: 'u' },
	'www.youtube.com': { type: 'search', key: 'q' },
}

function fixUrl(old_url) {
	const url = new URL(old_url)
	const hostname = url.hostname
	const conf = URLS[hostname] || {}

	let new_url = ''
	switch (conf.type) {
		case 'search':
			new_url = (new URLSearchParams(url.search)).get(conf.key)
			break;
		default:
			new_url = old_url
			break;
	}

	return new_url
}

chrome.runtime.onInstalled.addListener(function() {
	// add ability to disable some of menus

	// chrome.contextMenus.create({
	// 	id: 'remove_redirect',
	// 	title: 'Remove redirect',
	// 	contexts: ['link'],
	// })
	chrome.contextMenus.create({
		id: 'open_without_redirect',
		title: 'Open without redirect',
		contexts: ['link'],
	})
})

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	// info: { linkUrl, menuItemId, pageUrl }
	// tab: { id }
	switch (info.menuItemId) {
		// case 'remove_redirect':
		// 	break;
		case 'open_without_redirect':
			chrome.tabs.create({
				url: fixUrl(info.linkUrl)
			})
			break;
	}
})
