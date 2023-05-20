# Xano JavaScript SDK

The Xano JavaScript SDK is built in pure TypeScript. Under
the hood the SDK uses [Axios](https://github.com/axios/axios) which is not only supported by all modern browsers but allows us to
be compatible with NodeJS as well.

Questions, comments or suggestions? Join the #js-sdk channel in the [Xano Builders Slack](https://join.slack.com/t/xanobuilders/shared_invite/zt-1i9p6s1on-XIAP6ezx2nBFB8FpR7OWuA)

[![npm version](https://img.shields.io/npm/v/@xano/js-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@xano/js-sdk)

## What is Xano?

Xano is the fastest way to build a powerful, scalable backend for your app without code.

Xano gives you a scalable server, a flexible database, and a NO CODE API builder that can
transform, filter, and integrate with data from anywhere. We want to enable you to 
validate AND grow your ideas quickly without limits or any of the barriers you might 
have encountered using other tools. :muscle:

## Xano Links

- :globe_with_meridians: [Xano Homepage](https://xano.com/)
- :rocket: [Xano Documentation](https://docs.xano.com/)
- :book: [Xano Blog](https://www.xano.com/blog/)
- :house_with_garden: [Xano Community](https://community.xano.com/home)


## Installation

Include our script tag directly from jsDelivr:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@xano/js-sdk@latest/dist/xano.min.js"></script>
```

OR use `npm` to install the Xano JS SDK module:

```sh
npm install @xano/js-sdk
```

OR use our pre-bundled JS bundle:

```html
<script type="text/javascript" src="dist/xano.min.js"></script>
```

## NodeJS

NodeJS users should use our `XanoNodeClient` instead of `XanoClient`. The documentation is the same, it just takes care of some inconsistencies from the web behind the scenes.

Since NodeJS isn't a browser, the `storage` configuration is defaulted to [XanoObjectStorage](#xanobasestorage).

## Examples

### Pre-baked Examples

Examples for all methods and simple use-cases can be found in the `/examples` folder.

### Uploading a file

Uploading a file can be a pretty complex process but we tried our best to make it as easy as possible - simply include the file as a parameter just like you would any other:

```js
const file = document.getElementById('file').files[0];

xano.post('/file_upload', {
    'file': file
}).then(
    (response) => {
        // Success!
    },
    (error) => {
        // Failure
    }
);
```

NodeJS users should refer to our [XanoFile](#xanofile) class.

## Client Documentation

### `XanoClient`

This is the primary client class of Xano. It can be instantiated with the following parameters:

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| `apiGroupBaseUrl` | `string \| null` | `null` | API Group Base URL can be found on the API Group dashboard
| `authToken` | `string \| null` | `null` | Auth token generated in Xano from a login route (ex. `/auth/login`). Depending on `storage` this value will persist when set/cleared
| `customAxiosRequestConfig` | `Partial<AxiosRequestConfig>` | `{}` | For extreme edge cases, you can override the default Axios config that the SDK uses. [AxiosRequestConfig Documentation](https://axios-http.com/docs/req_config). Useful for ignoring SSL cert issues, etc
| `dataSource` | `string \| null` | `null` | Name of the [Xano Data Source](https://docs.xano.com/database/data-sources) to use as the `X-Data-Source` header
| `responseObjectPrefix` | `string \| null` | `null` | If the API response body is an object or an array of objects then this will prefix all keys with this value
| `storage` | `XanoBaseStorage` | `XanoLocalStorage` | The storage mechanism where we store persistant information like `authToken`

Usage: 
```js
import { XanoClient } from '@xano/js-sdk';

const xano = new XanoClient({
    'apiGroupBaseUrl': 'https://x8ki-letl-twmt.n7.xano.io/api:jVuUQATw'
});
```

### `XanoClient.hasAuthToken`

Checks to see if the `authToken` has been set.

Usage:
```js
xano.setAuthToken('eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBM....');

console.log(xano.hasAuthToken()); // true
```

### `XanoClient.setAuthToken`

Sets the authentication token which makes future requests authenticated.

Depending on `storage` when configuring `XanoClient` this value could persist across browser reloads.

| Param | Type | Description |
| --- | --- | --- |
| `authToken` | `string \| null` | Can be created from the `/auth/login` endpoint. `null` will clear the token

Usage:
```js
xano.setAuthToken('eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBM....');
```

### `XanoClient.hasDataSource`

Checks to see if the `dataSource` has been set.

Usage:
```js
xano.setDataSource('develop');

console.log(xano.hasDataSource()); // true
```

### `XanoClient.setDataSource`

Sets the data source which makes future requests include the `X-Data-Source` header.

More information about data sources can be [found here](https://docs.xano.com/database/data-sources)

| Param | Type | Description |
| --- | --- | --- |
| `dataSource` | `string \| null` | The name of the data source to use

Usage:
```js
xano.setDataSource('develop');
```

### `XanoClient.get`

Makes a GET HTTP request to Xano.

This function returns a Promise that resolves to `XanoResponse` on success and `XanoRequestError` on failure.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | `yes` | The endpoint starting with a `/` (ex. `/users`)
| `params` | `object` | `no` | URL params to attach to the request
| `headers` | `object` | `no` | Key/value pair of headers to send with the request

Usage:
```js
xano.get('/users', {
    'sort_by': 'name'
}).then(
    (response) => {
        // Success!
    },
    (error) => {
        // Failure
    }
);
```

### `XanoClient.post`

Makes a POST HTTP request to Xano.

This function returns a Promise that resolves to `XanoResponse` on success and `XanoRequestError` on failure.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | `yes` | The endpoint starting with a `/` (ex. `/users`)
| `params` | `object` | `no` | body params to attach to the request
| `headers` | `object` | `no` | Key/value pair of headers to send with the request

Usage:
```js
xano.post('/users', {
    'first_name': 'Justin',
    'last_name': 'Albrecht'
}).then(
    (response) => {
        // Success!
    },
    (error) => {
        // Failure
    }
);
```

### `XanoClient.patch`

Makes a PATCH HTTP request to Xano.

This function returns a Promise that resolves to `XanoResponse` on success and `XanoRequestError` on failure.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | `yes` | The endpoint starting with a `/` (ex. `/users`)
| `params` | `object` | `no` | body params to attach to the request
| `headers` | `object` | `no` | Key/value pair of headers to send with the request

Usage:
```js
xano.patch('/users', {
    'first_name': 'Justin'
}).then(
    (response) => {
        // Success!
    },
    (error) => {
        // Failure
    }
);
```

### `XanoClient.put`

Makes a PUT HTTP request to Xano.

This function returns a Promise that resolves to `XanoResponse` on success and `XanoRequestError` on failure.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | `yes` | The endpoint starting with a `/` (ex. `/users`)
| `params` | `object` | `no` | body params to attach to the request
| `headers` | `object` | `no` | Key/value pair of headers to send with the request

Usage:
```js
xano.put('/users', {
    'last_name': 'Albrecht'
}).then(
    (response) => {
        // Success!
    },
    (error) => {
        // Failure
    }
);
```

### `XanoClient.delete`

Makes a DELETE HTTP request to Xano.

This function returns a Promise that resolves to `XanoResponse` on success and `XanoRequestError` on failure.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | `yes` | The endpoint starting with a `/` (ex. `/users`)
| `params` | `object` | `no` | body params to attach to the request
| `headers` | `object` | `no` | Key/value pair of headers to send with the request

Usage:
```js
xano.delete('/users/1', {
    'optional': 'abc'
}).then(
    (response) => {
        // Success!
    },
    (error) => {
        // Failure
    }
);
```

### `XanoClient.head`

Makes a HEAD HTTP request to Xano.

This function returns a Promise that resolves to `XanoResponse` on success and `XanoRequestError` on failure.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | `yes` | The endpoint starting with a `/` (ex. `/users`)
| `params` | `object` | `no` | URL params to attach to the request
| `headers` | `object` | `no` | Key/value pair of headers to send with the request

Usage:
```js
xano.head('/users/1', {
    'optional': 'abc'
}).then(
    (response) => {
        // Success!
    },
    (error) => {
        // Failure
    }
);
```

### `XanoResponse`

The response class of a successful `GET`/`POST`/`PATCH`/`PUT`/`DELETE`/`HEAD` request.

| Function | Params | Return Type | Description |
| --- | --- | --- | --- |
| `getBody` | `objectPrefix: string` | `any` | <ul><li>If the API response is JSON it will be the JSON encoded result</li><li>If the API response is text then it will be the text result</li><li>If `objectPrefix` is set and the response is a JSON object or an array of objects then all keys will be prefixed with this value</li><li>`objectPrefix` will take priority over setting it on `XanoClient` through `responseObjectPrefix`</li></ul>
| `getHeaders` |  | `object` | key/value pairs of the response headers
| `getStatusCode` |  | `number` | The status code of the HTTP request

Usage: 
```js
xano.get('/users').then(
    (response) => {
        const body = response.getBody();
        const headers = response.getHeaders();
        const statusCode = response.getStatusCode();
    }
);
```

### `XanoRequestError`

The response class of a failed `GET`/`POST`/`PATCH`/`PUT`/`DELETE`/`HEAD` request.

This class extends the JS [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.

| Param | Type | Return Type | Description |
| --- | --- | --- | --- |
| `getResponse` | `function` | `XanoResponse` | Returns XanoResponse to get more information like HTTP status, headers, etc
| `message` | `string` | `string` | A generic human readable error message

Usage: 
```js
xano.get('/users').then(
    (response) => {

    },
    (error) => {
        const xanoHttpResponse = error.getResponse();

        const body = xanoHttpResponse.getBody();
        const headers = xanoHttpResponse.getHeaders();
        const statusCode = xanoHttpResponse.getStatusCode();
    }
);
```

### `XanoFile`

`XanoFile` is a class for NodeJS only!

The `XanoFile` class is required to upload a file from the NodeJS file system.

| Param | Type | Description |
| --- | --- | --- |
| `name` | `string` | The name of the file
| `buffer` | `Buffer` | Buffer of the file

Usage:
```js
const fs = require('fs/promises');

const fileName = '512x512bb.jpg';

fs.readFile('./' + fileName).then(
    (imageBuffer) => {
        const xImage = new XanoFile(fileName, imageBuffer);

        xano.post('/file_upload', {
            'image': xImage
        }).then(
            (response) => {
                // Success!
            },
            (error) => {
                // Error
            }
        );
    }
);
```

### `XanoBaseStorage`

The `XanoBaseStorage` class is extended for storing/retrieving information like the `authToken`.

Xano supplies four Storage classes by default:
| Class Name | Storage Mechanism | Persistant | NodeJS Compatible
| --- | --- | --- | --- |
| `XanoCookieStorage` | `document.cookie` | `yes` | `no`
| `XanoLocalStorage` | `localStorage` | `yes` | `no`
| `XanoSessionStorage` | `sessionStorage` | `yes` | `no`
| `XanoObjectStorage` | `Object` | `no` | `yes`

Each class that extends `XanoBaseStorage` share the following functions:

| Function | Params | Return Type | Description |
| --- | --- | --- | --- |
| `clear` | | `void` | Clears all storage keys
| `getAll` | | `Record<string, string>` | Returns all data stored in `XanoBaseStorage`
| `getItem` | `key: string` | `string \| null` | Returns the value for the `key`, or `null` if not set
| `removeItem` | `key: string` | `void` | Removes the `key` and `value` from storage
| `setItem` | `key: string`, `value: string` | `void` | Updates storage for `key` with `value`

Usage: 
```js
import { XanoClient, XanoSessionStorage } from '@xano/js-sdk';

const xano = new XanoClient({
    'apiGroupBaseUrl': 'https://x8ki-letl-twmt.n7.xano.io/api:jVuUQATw',
    'storage': new XanoSessionStorage()
});
```

## TypeScript support

This package includes TypeScript declarations. We support projects 
using TypeScript versions >= 3.1.