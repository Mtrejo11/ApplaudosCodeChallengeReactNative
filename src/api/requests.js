export const getContentList = async (reference, type) => {
    try {

        const url = `${reference}/${type}`

        const response = await fetch(url, {
            method: "GET", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            }
        });
        // console.log("FIRST RESPONSE", response);
        const second_response = await response.json();
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
        const url = `https://kitsu.io/api/edge/categories?page[limit]=3`
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const second_response = await response.json();
        // console.log('second response', second_response);
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



export const getContentData = async (reference) => {
    try {
        const response = await fetch(reference, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const second_response = await response.json();
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




export const getEachDetail = async (reference) => {
    try {
        const response = await fetch(reference, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const second_response = await response.json();
        if (response.status === 200) {
            return second_response
        } else {
            throw new Error(second_response)
        }
    } catch (error) {
        console.log('ERROR', error);
        return error
    }
}