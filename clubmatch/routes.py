from views import index

from clubs.views import get_clubs


def setup_routes(app):
    app.router.add_get('/', index)
    app.router.add_get('/clubs', get_clubs)
    app.router.add_static('/static/', path=str('./clubmatch/static'))
