import { AxiosResponse } from 'axios';
export declare class XanoResponse {
    private body;
    private headers;
    private objectPrefix;
    private status;
    constructor(response: AxiosResponse, objectPrefix?: string);
    private prefixArray;
    private prefixObject;
    private typeOf;
    getBody(objectPrefix?: string): any;
    getHeaders(): Record<string, string>;
    getStatusCode(): number;
}
//# sourceMappingURL=response.d.ts.map