export type HTTPMessage = {
    headers: Record<string, string>;
    body: string;
};

export type Request = {
    client: HTTPMessage;
    server: HTTPMessage | null;
    path: string;
    status_code: number;
};

