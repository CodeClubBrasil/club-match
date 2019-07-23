from aiohttp import web
from clients.code_club import CodeClubClient
from search.clubs import SearchClubs


async def get_clubs(request):
    search_query = request.query.get('search')

    client = CodeClubClient()
    clubs = await client.get_clubs(
        params={
            'per_page': 1000,
            'in_country': 'BR'
        }
    )

    if search_query:
        search_clubs = SearchClubs(clubs=clubs)
        clubs = search_clubs.search(query=search_query)

    return web.json_response(clubs)
