from search.normalizer import Normalizer


class SearchClubs:
    INDEX = {}
    CLUBS_INDEX = {}
    CLUBS = []

    _STOPWORDS = ['de', 'para', 'com', 'por', 'em', 'do', 'da', 'se']

    def __init__(self, clubs):
        if not self.INDEX:
            self.CLUBS = clubs
            self.__index()

    def __index(self):
        fields_to_search = [
            'address_1',
            'address_2',
            'city',
            'postcode',
            'region'
        ]

        for club in self.CLUBS:
            club_id = club['id']
            club_name = club['name']

            address_fields = []
            for key in fields_to_search:
                address_fields.append(club['venue']['address'].get(key) or '')

            searchable_str = ' '.join(address_fields) + ' ' + club_name
            searchable_str = Normalizer().normalize_text(searchable_str)

            for term in searchable_str.split():
                term = term.lower()

                if term in self._STOPWORDS:
                    continue

                if term not in self.INDEX:
                    self.INDEX[term] = []

                self.INDEX[term].append(club_id)
                self.CLUBS_INDEX[club_id] = club

    def search(self, query):
        query = Normalizer().normalize_text(query)

        sort_by_match = {}
        results = []

        for term in query.split():
            if term in self._STOPWORDS:
                continue

            if term not in self.INDEX:
                continue

            for club_id in set(self.INDEX[term]):
                if club_id not in sort_by_match:
                    sort_by_match[club_id] = 0
                sort_by_match[club_id] += 1

        for club_id in sorted(
            sort_by_match.items(),
            key=lambda x: (x[1]), reverse=True
        ):
            results.append(self.CLUBS_INDEX[club_id[0]])

        return results

    def __and_search(self, query):
        query = Normalizer().normalize_text(query)
        clubs = []

        for term in query.split():
            if term in self.STOPWORDS:
                continue

            if term not in self.INDEX:
                continue

            if not clubs:
                clubs = set(self.INDEX[term])
            else:
                clubs = set(self.INDEX[term]).intersection(clubs)

        return clubs
