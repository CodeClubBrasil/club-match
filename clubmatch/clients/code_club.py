import requests
import os


class CodeClubClient:
    # Documentation:
    # https://codeclubworldapiv2.docs.apiary.io/
    TOKEN = os.getenv('CC_API_TOKEN', '')
    HOST = 'https://api.codeclubworld.org'

    def _get_auth_headers(self):
        return {'Authorization': self.TOKEN}

    async def get_clubs(self, params=None):
        response = requests.get(
            url=f'{self.HOST}/clubs',
            headers=self._get_auth_headers(),
            params=params
        )
        response.raise_for_status()

        return response.json()
