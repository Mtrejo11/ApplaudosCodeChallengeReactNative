import { ADD_FAVORITE, DELETE_FAVORITE, GET_CATEGORIES } from '../actions'
const INITIAL_STATE = {
    initialType: 'anime',
    animeCategories: [],
    mangaCategories: [],
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

        case ADD_FAVORITE:

            return {
                ...state,
                ...action.payload
            }

        case DELETE_FAVORITE:

            return {
                ...state,
                ...action.payload

            }

        default:
            return state;
    }
}

export default classification;