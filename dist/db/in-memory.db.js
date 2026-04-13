"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const video_1 = require("../videos/types/video");
exports.db = {
    mockVideos: [
        {
            id: 1,
            title: "TypeScript Basics",
            author: "Anna",
            canBeDownloaded: true,
            minAgeRestriction: 12,
            createdAt: "2026-04-10T10:00:00.000Z",
            publicationDate: "2026-04-15T10:00:00.000Z",
            availableResolutions: [video_1.availableResolutionsType.P144, video_1.availableResolutionsType.P240]
        },
        {
            id: 2,
            title: "React Hooks Guide",
            author: "Ivan",
            canBeDownloaded: false,
            minAgeRestriction: 16,
            createdAt: "2026-03-21T08:30:00.000Z",
            publicationDate: "2026-03-25T08:30:00.000Z",
            availableResolutions: [video_1.availableResolutionsType.P360, video_1.availableResolutionsType.P480],
        },
        {
            id: 3,
            title: "Node.js Crash Course",
            author: "Maria",
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: "2026-02-01T12:00:00.000Z",
            publicationDate: "2026-02-10T12:00:00.000Z",
            availableResolutions: [video_1.availableResolutionsType.P720, video_1.availableResolutionsType.P1080, video_1.availableResolutionsType.P1440, video_1.availableResolutionsType.P2160],
        },
    ],
};
