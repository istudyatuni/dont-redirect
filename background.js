function link_2gis(link) {
	// https://link.2gis.ru/[version]/...%2F...
	const str = link.split('/').at(-1).split('%2F')[0]
	return atob(str).split('\n')[0]
}

const URLS = {
	'4pda.to': { type: 'search', key: 'u' },
	'adfoc.us': { type: 'search', key: 'url' },
	'l.instagram.com': { type: 'search', key: 'u' },
	'link.2gis.ru': { type: 'function', fun: link_2gis },
	'redirect.epicgames.com': { type: 'search', key: 'redirectTo' },
	'steamcommunity.com': { type: 'search', key: 'url' },
	'via.intercom.io': { type: 'search', key: 'url' },
	'vk.com': { type: 'search', key: 'to' },
	'www.youtube.com': { type: 'search', key: 'q' },
}

function fixUrl(old_url) {
	const url = new URL(old_url)
	const hostname = url.hostname
	const conf = URLS[hostname] || {}

	let new_url
	switch (conf.type) {
		case 'function':
			new_url = conf.fun(old_url)
			break;
		case 'search':
			new_url = (new URLSearchParams(url.search)).get(conf.key)
			break;
		default:
			new_url = old_url
			break;
	}

	// will return null if link is known but it's not redirect
	return new_url // === old_url ? new_url : fixUrl(new_url)
}

chrome.runtime.onInstalled.addListener(function() {
	// add ability to disable some menus

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
			let url = fixUrl(info.linkUrl)
			console.log('to', url)
			if (url) {
				chrome.tabs.create({ url })
			}
			break;
	}
})
