import requests


class CodeClubClient:
    # Documentation:
    # https://codeclubworldapiv2.docs.apiary.io/
    TOKEN = 'RObf83e126283b38f1e512429cb4539ab360aabda9f41682348af5a8aed530c2aa'
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
