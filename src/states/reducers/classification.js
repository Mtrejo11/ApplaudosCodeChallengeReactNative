import { GET_CATEGORIES } from '../actions'
const INITIAL_STATE = {
    initialType: 'anime',
    categories: [],
    animes: [],
    mangas: [],
    juanes: [],
};

const classification = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export default classification;