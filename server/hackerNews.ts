import * as hn from 'node-hn-api';

export const getUser = async (userName: string) => {
    const userData = await hn.fetchUser(userName);
    return userData;
};

export const getSubmission = async (submissionId: number) => {
    const data = await hn.fetchItem(submissionId);
    return data;
};