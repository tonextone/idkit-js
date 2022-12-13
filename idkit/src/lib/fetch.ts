'use client'

type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>

declare global {
	// eslint-disable-next-line no-var
	var cleanFetch: Fetch
}

/**
 * Uses `fetch` from a clean iFrame to prevent tampering with the global fetch object that may leak user data.
 * @returns
 */
const getCleanFetch = () => {
	const iframe = document.createElement('iframe')
	document.body.appendChild(iframe)
	const cleanFetch = iframe.contentWindow?.fetch.bind(iframe)
	document.body.removeChild(iframe)
	return cleanFetch
}

const _cleanFetch = getCleanFetch()

if (_cleanFetch) {
	global.cleanFetch = _cleanFetch
} else {
	throw new Error('Could not create `cleanFetch`. Please report this issue.')
}

const cleanFetch: Fetch = global.cleanFetch

export default cleanFetch