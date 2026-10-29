export function securityHeaders(dev = false) {
  const policy = [
    "default-src 'self'",
    `script-src 'self'${dev ? " 'unsafe-inline'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob:",
    `connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebasedatabase.app wss://*.firebasedatabase.app${dev ? ' ws://127.0.0.1:* ws://localhost:*' : ''}`,
    "object-src 'none'", "base-uri 'self'", "form-action 'self'",
    "frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com",
  ].join('; ');
  return {
    'Content-Security-Policy': policy,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  };
}
