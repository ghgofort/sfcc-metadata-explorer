/**
 * @file ICallSetup.ts
 * @fileoverview - An interface that describes the arguments needed for the
 * constructor method of the CallSetup class.
 */

export enum HTTP_VERB {
  delete = 'DELETE',
  get = 'GET',
  patch = 'PATCH',
  post = 'POST',
  put = 'PUT'
}

/**
 * @interface ICallSetup - Describes the arguments needed for making a call to
 * the OCAPIService class. This is also what is returned from the callSetup()
 * method of the OCAPIService class.
 */
export interface ICallSetup {
  body?: any;
  callName?: string;
  endpoint: string;
  headers: {
    contentType: string,
    [propName: string]: string;
  };
  method: HTTP_VERB;
  setupError?: boolean;
  setupErrMsg?: string;
}
