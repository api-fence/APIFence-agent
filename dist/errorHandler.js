"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apifenceErrorHandler = apifenceErrorHandler;
const agent_1 = require("./agent");
function apifenceErrorHandler() {
    return (err, req, res, next) => {
        agent_1.APIFenceAgent.addEvent({
            type: "error",
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method,
            statusCode: err.status || 500,
            message: err.message,
            stack: err.stack
        });
        next(err);
    };
}
