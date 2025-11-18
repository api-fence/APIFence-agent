export interface APIFenceConfig {
    apiKey: string;
    serviceName: string;
    maskFields?: string[];
    endpoint?: string;
    environment?: string;
    host?: string;
    region?: string;
  }
  
  export interface APIFenceEvent {
    type: "request" | "error";
    timestamp: string;
    path: string;
    method?: string;
    statusCode?: number;
    duration?: number;
    message?: string;
    stack?: string;
    ip?: string;
    userAgent?: string;
  }
  