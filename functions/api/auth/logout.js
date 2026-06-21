export async function onRequestPost() {
  return new Response(JSON.stringify({ authenticated: false }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'set-cookie':
        'presentation_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
    }
  })
}
