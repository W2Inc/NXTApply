// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { $ } from "bun";

// ============================================================================
// Run this script if you wish to use https locally using HTTP1.1
// ============================================================================

$`rm -rf .cert`
$`mkdir -p .cert`
$`penssl req -x509 -newkey rsa:2048 -keyout .cert/key.pem -out .cert/cert.pem -days 365 -nodes -subj "/CN=localhost"`
console.log(`
Please add the following lines to your vite.config.ts:
---
server: {
	proxy: {}, // See: https://github.com/oven-sh/bun/issues/14825#issuecomment-3255988114
	https: {
		key: fs.readFileSync('.cert/key.pem'),
		cert: fs.readFileSync('.cert/cert.pem')
	}
}
`)
