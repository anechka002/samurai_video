"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = void 0;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["Ok_200"] = 200] = "Ok_200";
    HttpStatus[HttpStatus["Created_201"] = 201] = "Created_201";
    HttpStatus[HttpStatus["NoContent_204"] = 204] = "NoContent_204";
    HttpStatus[HttpStatus["BadRequest_400"] = 400] = "BadRequest_400";
    HttpStatus[HttpStatus["Unauthorized_401"] = 401] = "Unauthorized_401";
    HttpStatus[HttpStatus["Forbidden_403"] = 403] = "Forbidden_403";
    HttpStatus[HttpStatus["NotFound_404"] = 404] = "NotFound_404";
    HttpStatus[HttpStatus["InternalServerError_500"] = 500] = "InternalServerError_500";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
