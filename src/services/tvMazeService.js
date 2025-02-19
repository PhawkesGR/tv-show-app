const BASE_URL = 'https://api.tvmaze.com';

export const tvMazeService = {
    async getShowById(id) {
        try {
            const response = await fetch(`${BASE_URL}/shows/${id}?embed=cast`);
            const show = await response.json();

            return {
                id: show.id,
                title: show.name,
                imageUrl: show.image?.original || show.image?.medium,
                rating: show.rating?.average,
                genres: show.genres,
                summary: show.summary,
                premiered: show.premiered,
                status: show.status,
                network: show.network?.name,
                country: show.network?.country?.name,
                language: show.language,
                runtime: show.runtime,
                cast: show._embedded?.cast.map(castMember => ({ name: castMember.person.name, character: castMember.character.name, id: castMember.person.id, imageUrl: castMember.person.image?.medium || castMember.person.image?.original })),
            }
        } catch (error) {
            console.error(`Error fetching show ${id}:`, error);
            throw error;
        }
    },

    async getShows(page = 0) {
        const response = await fetch(`${BASE_URL}/shows?page=${page}`);
        const shows = await response.json();
        return shows.map(show => ({
            id: show.id,
            title: show.name,
            imageUrl: show.image?.medium || show.image?.original,
            rating: show.rating?.average,
            genres: show.genres,
        }))
    },

    async getAllGenresWithShows(pagesToLoad = 3) {
        try {
            // make 3 calls to the API to get as many genres as possible
            const showPromises = Array.from({ length: pagesToLoad }, (_, i) =>
                this.getShows(i)
            );

            const showPages = await Promise.all(showPromises);
            const allShows = showPages.flat();

            const uniqueGenres = new Set(allShows.flatMap(show => show.genres));

            const showsByGenre = {};
            uniqueGenres.forEach(genre => {
            showsByGenre[genre] = allShows
                .filter(show => show.genres.includes(genre))
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 20)
            });

            return showsByGenre;
        } catch (error) {
            console.error('Error fetching shows:', error);
            throw error;
        }
    },

    async searchShows(query) {
        try {
            if (!query.trim()) return [];

            const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            return data.map(item => ({
                id: item.show.id,
                title: item.show.name,
                imageUrl: item.show.image?.medium || item.show.image?.original,
                rating: item.show.rating?.average,
                genres: item.show.genres,
            })).slice(0, 10);
        } catch (error) {
            console.error('Error searching shows:', error);
            throw error;
        }
    },
}