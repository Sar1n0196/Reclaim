import { XanoClientConfig } from './interfaces/client-config';
import { XanoResponse } from './models/response';
export declare abstract class XanoBaseClient {
    private config;
    constructor(config: Partial<XanoClientConfig>);
    protected abstract getFormDataInstance(): any;
    protected abstract appendFormData(formData: any, key: string, value: any): void;
    private buildFormData;
    private isFileType;
    private request;
    hasAuthToken(): boolean;
    setAuthToken(authToken: string | null): this;
    hasDataSource(): boolean;
    setDataSource(dataSource: string | null): this;
    delete(endpoint: string, params?: Record<any, any>, headers?: Record<any, any>): Promise<XanoResponse>;
    get(endpoint: string, params?: Record<any, any>, headers?: Record<any, any>): Promise<XanoResponse>;
    head(endpoint: string, params?: Record<any, any>, headers?: Record<any, any>): Promise<XanoResponse>;
    patch(endpoint: string, params?: Record<any, any>, headers?: Record<any, any>): Promise<XanoResponse>;
    post(endpoint: string, params?: Record<any, any>, headers?: Record<any, any>): Promise<XanoResponse>;
    put(endpoint: string, params?: Record<any, any>, headers?: Record<any, any>): Promise<XanoResponse>;
}
//# sourceMappingURL=base-client.d.ts.map