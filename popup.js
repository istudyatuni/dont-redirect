function clean() {
	const input_url = document.getElementById('input-url').value
	document.getElementById('clean-url').value = fixUrl(input_url)
}

document.getElementById('cleanBtn').addEventListener('click', clean)
