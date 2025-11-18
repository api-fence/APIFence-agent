"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIFenceAgent = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
class APIFenceAgent {
    static init(config) {
        this.config = {
            endpoint: "https://api.apifence.cloud/api/api-monitor/events",
            maskFields: ["password", "token", ...(config.maskFields || [])],
            ...config,
        };
        this.startQueue();
    }
    static addEvent(event) {
        if (!this.config) {
            return;
        }
        this.queue.push(event);
    }
    static transformEvent(event) {
        const isError = event.type === "error";
        // Build the payload structure matching the expected API format
        const transformed = {
            apiKey: this.config.apiKey,
            eventType: event.type,
            route: event.path,
            method: event.method || "GET",
            statusCode: event.statusCode || (isError ? 500 : 200),
            responseTime: event.duration || 0,
            timestamp: event.timestamp,
            ip: event.ip,
            userAgent: event.userAgent,
            service: this.config.serviceName,
            metadata: {
                source: "sdk",
                version: "0.1.3",
                integrationType: "express"
            }
        };
        // Add environment, host, region if configured
        if (this.config.environment) {
            transformed.environment = this.config.environment;
        }
        if (this.config.host) {
            transformed.host = this.config.host;
        }
        if (this.config.region) {
            transformed.region = this.config.region;
        }
        // For errors, add error-specific fields
        if (isError) {
            transformed.severity = "critical";
            transformed.category = "application";
            transformed.payload = {
                error: event.message || "Unknown error",
                stack: event.stack,
                context: {
                    route: event.path,
                    method: event.method
                }
            };
        }
        else {
            // For requests, use appropriate category and severity
            transformed.category = "performance";
            // Map status codes to valid severity levels: low, medium, high, critical
            if (event.statusCode) {
                if (event.statusCode >= 500) {
                    transformed.severity = "high";
                    transformed.category = "application"; // Server errors are application issues
                }
                else if (event.statusCode >= 400) {
                    transformed.severity = "medium";
                    transformed.category = "application"; // Client errors are application issues
                }
                else {
                    transformed.severity = "low";
                }
            }
            else {
                transformed.severity = "low";
            }
        }
        return transformed;
    }
    static startQueue() {
        this.timer = setInterval(async () => {
            if (!this.queue.length)
                return;
            const batch = [...this.queue];
            this.queue = [];
            // Transform events to match the expected API format
            const transformedBatch = batch.map(event => this.transformEvent(event));
            // Send each event individually (or as a batch if API supports it)
            for (const event of transformedBatch) {
                try {
                    const response = await (0, cross_fetch_1.default)(this.config.endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(event)
                    });
                }
                catch (err) {
                    console.error("APIFenceAgent send error:", err);
                }
            }
        }, 1500);
    }
}
exports.APIFenceAgent = APIFenceAgent;
APIFenceAgent.queue = [];
