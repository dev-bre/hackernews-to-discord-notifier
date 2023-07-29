"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmission = exports.getUser = void 0;
const getUser = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield fetch(getUserURL(userName), {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    });
    return yield resp.json();
});
exports.getUser = getUser;
const getSubmission = (submissionId) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield fetch(getItemURL(submissionId.toString()), {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    });
    return yield resp.json();
});
exports.getSubmission = getSubmission;
const itemURL = 'https://hacker-news.firebaseio.com/v0/item/ITEM_ID.json';
const userURL = 'https://hacker-news.firebaseio.com/v0/user/USER_ID.json';
const getItemURL = (itemID) => {
    return itemURL.replace('ITEM_ID', itemID);
};
const getUserURL = (userId) => {
    return userURL.replace('USER_ID', userId);
};
