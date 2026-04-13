"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoInputDtoValidation = exports.createVideoInputDtoValidation = void 0;
const video_1 = require("../types/video");
const validateTitle = (title) => {
    if (typeof title !== 'string' ||
        title.trim().length < 2 ||
        title.trim().length > 40) {
        return { field: 'title', message: 'Invalid title' };
    }
    return null;
};
const validateAuthor = (author) => {
    if (typeof author !== 'string' ||
        author.trim().length < 1 ||
        author.trim().length > 20) {
        return { field: 'author', message: 'Invalid author' };
    }
    return null;
};
const validateAvailableResolutions = (resolutions) => {
    const allowedResolutions = Object.values(video_1.availableResolutionsType);
    if (!Array.isArray(resolutions)) {
        return { field: 'availableResolutions', message: 'Invalid available resolutions' };
    }
    if (resolutions.length > allowedResolutions.length || resolutions.length < 1) {
        return { field: 'availableResolutions', message: 'Invalid available resolutions' };
    }
    for (const el of resolutions) {
        if (!allowedResolutions.includes(el)) {
            return { field: 'availableResolutions', message: 'Invalid available ' + el };
        }
    }
    return null;
};
const validateCanBeDownloaded = (canBeDownloaded) => {
    if (typeof canBeDownloaded !== 'boolean') {
        return { field: 'canBeDownloaded', message: 'Invalid canBeDowloaded' };
    }
    return null;
};
const validateMinAgeRestriction = (minAgeRestriction) => {
    if (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18) {
        return { field: 'minAgeRestriction', message: 'Invalid minAgeRestriction ' + minAgeRestriction };
    }
    return null;
};
const validatePublicationDate = (publicationDate) => {
    if (typeof publicationDate !== 'string' || !publicationDate.trim()) {
        return { field: 'publicationDate', message: 'Invalid publicationDate ' + publicationDate };
    }
    return null;
};
// validation для create/post
const createVideoInputDtoValidation = (data) => {
    const errors = [];
    if (typeof data !== "object" || data === null) {
        return [{ field: 'body', message: 'Invalid body' }];
    }
    const body = data;
    const titleError = validateTitle(body.title);
    if (titleError) {
        errors.push(titleError);
    }
    const authorError = validateAuthor(body.author);
    if (authorError) {
        errors.push(authorError);
    }
    const availableResolutionsError = validateAvailableResolutions(body.availableResolutions);
    if (availableResolutionsError) {
        errors.push(availableResolutionsError);
    }
    return errors;
};
exports.createVideoInputDtoValidation = createVideoInputDtoValidation;
// validation для put
const updateVideoInputDtoValidation = (data) => {
    const errors = [];
    if (typeof data !== "object" || data === null) {
        return [{ field: 'body', message: 'Invalid body' }];
    }
    const body = data;
    const titleError = validateTitle(body.title);
    if (titleError) {
        errors.push(titleError);
    }
    const authorError = validateAuthor(body.author);
    if (authorError) {
        errors.push(authorError);
    }
    const availableResolutionsError = validateAvailableResolutions(body.availableResolutions);
    if (availableResolutionsError) {
        errors.push(availableResolutionsError);
    }
    const canBeDownloadedError = validateCanBeDownloaded(body.canBeDownloaded);
    if (canBeDownloadedError) {
        errors.push(canBeDownloadedError);
    }
    const minAgeRestrictionError = validateMinAgeRestriction(body.minAgeRestriction);
    if (minAgeRestrictionError) {
        errors.push(minAgeRestrictionError);
    }
    const publicationDateError = validatePublicationDate(body.publicationDate);
    if (publicationDateError) {
        errors.push(publicationDateError);
    }
    return errors;
};
exports.updateVideoInputDtoValidation = updateVideoInputDtoValidation;
