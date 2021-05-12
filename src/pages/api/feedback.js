import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import backend from '@/lib/backend'
import handler from '@/lib/api-handler'

export default handler().post(async ({ body: { description }, cookies }, res) => {
	let user
	try {
		user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
	} catch {
		//user is logged out
	}

	await backend.post(
		'/v1/feedback',
		{ description },
		{
			headers: {
				'X-Authenticated-User': user?.publicAddress || 'undefined', // Django is dumb ¯\_(ツ)_/¯
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.status(200).end()
})