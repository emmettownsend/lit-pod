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

import { describe, it, expect } from "@jest/globals";

jest.mock("./fetcher", () => ({
  fetch: jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve(
        new Response("Some data", { status: 200, statusText: "OK" })
      )
    ),
}));

import { unstable_fetchFile, unstable_deleteFile } from "./nonRdfData";
import { Headers, Response } from "cross-fetch";

describe("Non-RDF data fetch", () => {
  it("should GET a remote resource using the included fetcher if no other fetcher is available", async () => {
    const fetcher = jest.requireMock("./fetcher") as {
      fetch: jest.Mock<
        ReturnType<typeof window.fetch>,
        [RequestInfo, RequestInit?]
      >;
    };

    fetcher.fetch.mockReturnValue(
      Promise.resolve(
        new Response("Some data", { status: 200, statusText: "OK" })
      )
    );

    const response = await unstable_fetchFile("https://some.url");

    expect(fetcher.fetch.mock.calls).toEqual([["https://some.url", undefined]]);
    expect(response).toEqual(
      new Response("Some data", { status: 200, statusText: "OK" })
    );
  });

  it("should GET a remote resource using the provided fetcher", async () => {
    const mockFetch = jest
      .fn(window.fetch)
      .mockReturnValue(
        Promise.resolve(
          new Response("Some data", { status: 200, statusText: "OK" })
        )
      );

    const response = await unstable_fetchFile("https://some.url", {
      fetch: mockFetch,
    });

    expect(mockFetch.mock.calls).toEqual([["https://some.url", undefined]]);
    expect(response).toEqual(
      new Response("Some data", { status: 200, statusText: "OK" })
    );
  });

  it("should pass the request headers through", async () => {
    const mockFetch = jest
      .fn(window.fetch)
      .mockReturnValue(
        Promise.resolve(
          new Response("Some data", { status: 200, statusText: "OK" })
        )
      );

    const response = await unstable_fetchFile("https://some.url", {
      init: {
        headers: new Headers({ Accept: "text/turtle" }),
      },
      fetch: mockFetch,
    });

    expect(mockFetch.mock.calls).toEqual([
      [
        "https://some.url",
        {
          headers: new Headers({ Accept: "text/turtle" }),
        },
      ],
    ]);
    expect(response).toEqual(
      new Response("Some data", { status: 200, statusText: "OK" })
    );
  });

  it("should return the response even on failure", async () => {
    const mockFetch = jest
      .fn(window.fetch)
      .mockReturnValue(
        Promise.resolve(
          new Response(undefined, { status: 400, statusText: "Bad request" })
        )
      );

    const response = await unstable_fetchFile("https://some.url", {
      fetch: mockFetch,
    });

    expect(mockFetch.mock.calls).toEqual([["https://some.url", undefined]]);
    expect(response).toEqual(
      new Response(undefined, { status: 400, statusText: "Bad request" })
    );
  });
});

describe("Non-RDF data deletion", () => {
  it("should DELETE a remote resource using the included fetcher if no other fetcher is available", async () => {
    const fetcher = jest.requireMock("./fetcher") as {
      fetch: jest.Mock<
        ReturnType<typeof window.fetch>,
        [RequestInfo, RequestInit?]
      >;
    };

    fetcher.fetch.mockReturnValue(
      Promise.resolve(
        new Response(undefined, { status: 200, statusText: "Deleted" })
      )
    );

    const response = await unstable_deleteFile("https://some.url");

    expect(fetcher.fetch.mock.calls).toEqual([
      [
        "https://some.url",
        {
          method: "DELETE",
        },
      ],
    ]);
    expect(response).toEqual(
      new Response(undefined, { status: 200, statusText: "Deleted" })
    );
  });

  it("should DELETE a remote resource using the provided fetcher", async () => {
    const mockFetch = jest
      .fn(window.fetch)
      .mockReturnValue(
        Promise.resolve(
          new Response(undefined, { status: 200, statusText: "Deleted" })
        )
      );

    const response = await unstable_deleteFile("https://some.url", {
      fetch: mockFetch,
    });

    expect(mockFetch.mock.calls).toEqual([
      [
        "https://some.url",
        {
          method: "DELETE",
        },
      ],
    ]);
    expect(response).toEqual(
      new Response(undefined, { status: 200, statusText: "Deleted" })
    );
  });

  it("should pass through the request init if it is set by the user", async () => {
    const mockFetch = jest
      .fn(window.fetch)
      .mockReturnValue(
        Promise.resolve(
          new Response(undefined, { status: 200, statusText: "Deleted" })
        )
      );

    await unstable_deleteFile("https://some.url", {
      fetch: mockFetch,
      init: {
        mode: "same-origin",
      },
    });

    expect(mockFetch.mock.calls).toEqual([
      [
        "https://some.url",
        {
          method: "DELETE",
          mode: "same-origin",
        },
      ],
    ]);
  });

  it("should override the request method if it is set by the user", async () => {
    const mockFetch = jest
      .fn(window.fetch)
      .mockReturnValue(
        Promise.resolve(
          new Response(undefined, { status: 200, statusText: "Deleted" })
        )
      );

    await unstable_deleteFile("https://some.url", {
      fetch: mockFetch,
      init: {
        method: "HEAD",
      },
    });

    expect(mockFetch.mock.calls).toEqual([
      [
        "https://some.url",
        {
          method: "DELETE",
        },
      ],
    ]);
  });

  it("should return the response failed request", async () => {
    const mockFetch = jest.fn(window.fetch).mockReturnValue(
      Promise.resolve(
        new Response(undefined, {
          status: 400,
          statusText: "Bad request",
        })
      )
    );

    const response = await unstable_deleteFile("https://some.url", {
      fetch: mockFetch,
    });

    expect(response).toEqual(
      new Response(undefined, {
        status: 400,
        statusText: "Bad request",
      })
    );
  });
});
