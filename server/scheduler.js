"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initScheduledJobs = void 0;
const cronJob = __importStar(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
const hackerNews = __importStar(require("./hackerNews"));
dotenv_1.default.config();
const globalResults = [];
const initScheduledJobs = () => {
    const scheduledJobFunction = cronJob.schedule("*/1 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const userName = process.env.HN_USERNAME;
        const selectedPostId = process.env.HN_POST_ID;
        const discordWebHook = process.env.DISCORD_WEBHOOK;
        console.log("Starting check HackerNews -> Discord");
        const currentResults = yield grabContentFromHN(userName, selectedPostId);
        console.log(JSON.stringify(currentResults));
    }));
    scheduledJobFunction.start();
};
exports.initScheduledJobs = initScheduledJobs;
const grabContentFromHN = (userName, selectedPostId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield hackerNews.getUser(userName);
    //console.log(userData);
    const selectedPost = userData.submitted.filter(x => x === Number(selectedPostId))[0];
    const submissionData = yield hackerNews.getSubmission(selectedPost);
    //console.log(submissionData);
    const latestResults = [];
    latestResults.push({ id: submissionData.id, text: submissionData.text, time: submissionData.time });
    const kids = submissionData.kids;
    if (kids.length > 0) {
        for (let x = 0; x < kids.length; x++) {
            const childNode = {
                id: kids[x],
                text: submissionData.text,
                time: submissionData.time
            };
            yield callRecursively(childNode, latestResults);
        }
    }
    return latestResults;
});
const callRecursively = (node, results) => __awaiter(void 0, void 0, void 0, function* () {
    let curr = yield hackerNews.getSubmission(node.id);
    console.log(curr);
    const kids = curr.kids;
    results.push({ id: node.id, text: node.text, time: node.time });
    if (kids && kids.length > 0) {
        for (let x = 0; x < kids.length; x++) {
            const childNode = {
                id: kids[x],
                text: curr.text,
                time: curr.time
            };
            yield callRecursively(childNode, results);
        }
        //kids.forEach(async (node) => { await callRecursively(node, results); });
    }
});
