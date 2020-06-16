/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { fetch } from "./fetcher";

interface FetchFileOptions {
  fetch: typeof window.fetch;
  init: RequestInit;
}

const defaultFetchFileOptions = {
  fetch: fetch,
};

/**
 * Fetches a file at a given IRI, and returns it as a blob of data.
 *
 * Please note that this function is still experimental: its API can change in non-major releases.
 *
 * @param url The IRI of the fetched file
 * @param options Fetching options: a custom fetcher and/or headers.
 */
export async function unstable_fetchFile(
  input: RequestInfo,
  options: Partial<FetchFileOptions> = defaultFetchFileOptions
): Promise<Response> {
  const config = {
    ...defaultFetchFileOptions,
    ...options,
  };
  return config.fetch(input, config.init);
}

/**
 * Deletes a file at a given IRI
 *
 * Please note that this function is still experimental: its API can change in non-major releases.
 *
 * @param input The IRI of the file to delete
 */
export async function unstable_deleteFile(
  input: RequestInfo,
  options: Partial<FetchFileOptions> = defaultFetchFileOptions
): Promise<Response> {
  const config = {
    ...defaultFetchFileOptions,
    ...options,
  };
  return config.fetch(input, {
    ...options.init,
    method: "DELETE",
  });
}
