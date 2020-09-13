import { ADD_FAVORITE, DELETE_FAVORITE, GET_CATEGORIES } from '../actions'
const INITIAL_STATE = {
    initialType: 'anime',
    categories: [],
    animes: [],
    mangas: [],
    favorites: [],
};

const classification = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                ...action.payload
            }

        case ADD_FAVORITE: {
            const currentFavorites = state.favorites;
            currentFavorites.push(action.payload.title);
            console.log('CURRENT FAVS', currentFavorites);
            return {
                ...state,
                favorites: currentFavorites
            }
        }
        case DELETE_FAVORITE: {
            const currentFavorites = state.favorites;
            const index = currentFavorites.findIndex(title => title.id === action.payload.title.id);
            currentFavorites.splice(index, 1);
            console.log('CURRENT FAVS', currentFavorites);
            return {
                ...state,
                favorites: currentFavorites
            }
        }

        default:
            return state;
    }
}

export default classification;