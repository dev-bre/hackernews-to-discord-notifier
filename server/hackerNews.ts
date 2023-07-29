
export const getUser = async (userName: string) => {

    const resp = await fetch(getUserURL(userName), {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    });
    return await resp.json();
};

export const getSubmission = async (submissionId: number) => {
    const resp = await fetch(getItemURL(submissionId.toString()), {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    });
    return await resp.json();
};

const itemURL = 'https://hacker-news.firebaseio.com/v0/item/ITEM_ID.json';
const userURL = 'https://hacker-news.firebaseio.com/v0/user/USER_ID.json';

const getItemURL = (itemID: string) => {
    return itemURL.replace('ITEM_ID', itemID);
}

const getUserURL = (userId: string) => {
    return userURL.replace('USER_ID', userId);
}