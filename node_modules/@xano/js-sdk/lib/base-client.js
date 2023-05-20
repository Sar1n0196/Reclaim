"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XanoBaseClient = void 0;
var axios_1 = require("axios");
var content_type_1 = require("./enums/content-type");
var file_1 = require("./models/file");
var request_1 = require("./errors/request");
var request_type_1 = require("./enums/request-type");
var response_1 = require("./models/response");
var object_storage_1 = require("./models/object-storage");
var storage_keys_1 = require("./enums/storage-keys");
var XanoBaseClient = /** @class */ (function () {
    function XanoBaseClient(config) {
        this.config = {
            apiGroupBaseUrl: null,
            authToken: null,
            customAxiosRequestConfig: {},
            dataSource: null,
            responseObjectPrefix: '',
            storage: new object_storage_1.XanoObjectStorage(),
        };
        this.config = __assign(__assign({}, this.config), config);
        if ((config === null || config === void 0 ? void 0 : config.authToken) !== undefined) {
            if (typeof this.config.authToken === 'string' &&
                this.config.authToken.length > 0) {
                this.config.storage.setItem(storage_keys_1.XanoStorageKeys.AuthToken, this.config.authToken);
            }
            else {
                this.config.storage.removeItem(storage_keys_1.XanoStorageKeys.AuthToken);
            }
        }
    }
    XanoBaseClient.prototype.buildFormData = function (bodyData) {
        var _this = this;
        var formData = this.getFormDataInstance();
        var hasFile = false;
        var rawFormData = {};
        Object.entries(bodyData).forEach(function (entry) {
            var isFileType = _this.isFileType(entry[1]);
            if (isFileType) {
                hasFile = true;
            }
            rawFormData[entry[0]] = entry[1];
            if (entry[1] instanceof file_1.XanoFile) {
                formData.append(entry[0], entry[1].getBuffer(), entry[1].getName());
            }
            else {
                _this.appendFormData(formData, entry[0], entry[1]);
            }
        });
        return {
            formData: formData,
            hasFile: hasFile,
            rawFormData: rawFormData,
        };
    };
    XanoBaseClient.prototype.isFileType = function (instance) {
        if (typeof File !== 'undefined') {
            if (instance instanceof File) {
                return true;
            }
        }
        return instance instanceof file_1.XanoFile;
    };
    XanoBaseClient.prototype.request = function (params) {
        var _this = this;
        var axiosConfig = __assign(__assign({}, this.config.customAxiosRequestConfig), { baseURL: this.config.apiGroupBaseUrl, method: params.method, params: params.urlParams, url: params.endpoint, validateStatus: function () { return true; } });
        if (!axiosConfig.headers) {
            axiosConfig.headers = {};
        }
        if (params.headerParams) {
            axiosConfig.headers = __assign(__assign({}, axiosConfig.headers), params.headerParams);
        }
        if (this.hasAuthToken()) {
            var authToken = this.config.storage.getItem(storage_keys_1.XanoStorageKeys.AuthToken);
            axiosConfig.headers['Authorization'] = "Bearer ".concat(authToken);
        }
        if (this.hasDataSource()) {
            axiosConfig.headers['X-Data-Source'] = (this.config.dataSource);
        }
        if (params.bodyParams) {
            var ret = this.buildFormData(params.bodyParams);
            if (ret.hasFile) {
                axiosConfig.headers['Content-Type'] = content_type_1.XanoContentType.Multipart;
                axiosConfig.data = ret.formData;
            }
            else {
                axiosConfig.headers['Content-Type'] = content_type_1.XanoContentType.JSON;
                axiosConfig.data = JSON.stringify(ret.rawFormData);
            }
        }
        return axios_1.default.request(axiosConfig).then(function (response) {
            var _a;
            var resp = new response_1.XanoResponse(response, (_a = _this.config.responseObjectPrefix) !== null && _a !== void 0 ? _a : '');
            if (response.status < 200 || response.status >= 300) {
                throw new request_1.XanoRequestError('There was an error with your request', resp);
            }
            return resp;
        });
    };
    XanoBaseClient.prototype.hasAuthToken = function () {
        var authToken = this.config.storage.getItem(storage_keys_1.XanoStorageKeys.AuthToken);
        return typeof authToken === 'string' && authToken.length > 0;
    };
    XanoBaseClient.prototype.setAuthToken = function (authToken) {
        if (authToken === null) {
            this.config.storage.removeItem(storage_keys_1.XanoStorageKeys.AuthToken);
        }
        else {
            this.config.storage.setItem(storage_keys_1.XanoStorageKeys.AuthToken, authToken);
        }
        return this;
    };
    XanoBaseClient.prototype.hasDataSource = function () {
        return (typeof this.config.dataSource === 'string' &&
            this.config.dataSource.length > 0);
    };
    XanoBaseClient.prototype.setDataSource = function (dataSource) {
        this.config.dataSource = dataSource;
        return this;
    };
    XanoBaseClient.prototype.delete = function (endpoint, params, headers) {
        return this.request({
            bodyParams: params,
            endpoint: endpoint,
            method: request_type_1.XanoRequestType.DELETE,
            headerParams: headers,
        });
    };
    XanoBaseClient.prototype.get = function (endpoint, params, headers) {
        return this.request({
            endpoint: endpoint,
            method: request_type_1.XanoRequestType.GET,
            urlParams: params,
            headerParams: headers,
        });
    };
    XanoBaseClient.prototype.head = function (endpoint, params, headers) {
        return this.request({
            endpoint: endpoint,
            method: request_type_1.XanoRequestType.HEAD,
            urlParams: params,
            headerParams: headers,
        });
    };
    XanoBaseClient.prototype.patch = function (endpoint, params, headers) {
        return this.request({
            bodyParams: params,
            endpoint: endpoint,
            method: request_type_1.XanoRequestType.PATCH,
            headerParams: headers,
        });
    };
    XanoBaseClient.prototype.post = function (endpoint, params, headers) {
        return this.request({
            bodyParams: params,
            endpoint: endpoint,
            method: request_type_1.XanoRequestType.POST,
            headerParams: headers,
        });
    };
    XanoBaseClient.prototype.put = function (endpoint, params, headers) {
        return this.request({
            bodyParams: params,
            endpoint: endpoint,
            method: request_type_1.XanoRequestType.PUT,
            headerParams: headers,
        });
    };
    return XanoBaseClient;
}());
exports.XanoBaseClient = XanoBaseClient;
//# sourceMappingURL=base-client.js.map