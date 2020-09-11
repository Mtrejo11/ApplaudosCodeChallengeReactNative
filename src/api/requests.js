export const GET_FULL_LIST = async (type) => {
    try {

        const url = `https://kitsu.io/api/edge/${type}`

        const response = await fetch(url, {
            method: "GET", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            }
        });
        // console.log("FIRST RESPONSE", response);
        const second_response = await response.json();
        console.log('second response', second_response);
        if (response.status === 200) {
            return ({ status: true, message: second_response });
        } else {
            throw new Error(second_response)
        }
    } catch (error) {
        console.log('ERROR', error);
        return { status: false, message: error }
    }
}


export const getCategories = async () => {
    try {

        const url = `https://kitsu.io/api/edge/categories/`

        const response = await fetch(url, {
            method: "GET", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            }
        });
        // console.log("FIRST RESPONSE", response);
        const second_response = await response.json();
        console.log('second response', second_response);
        if (response.status === 200) {
            return ({ status: true, message: second_response });
        } else {
            throw new Error(second_response)
        }
    } catch (error) {
        console.log('ERROR', error);
        return { status: false, message: error }
    }
}
