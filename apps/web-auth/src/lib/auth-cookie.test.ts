// apps/web-auth/src/lib/auth-cookie.test.ts
import { jwtDecode } from "jwt-decode";
import {
  AUTH_COOKIE,
  decodeToken,
  getAuthCookie,
  REFRESH_COOKIE,
} from "./auth-cookie";

// --- Mocking jwtDecode ---
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn((token: string) => {
    if (!token) throw new Error("Invalid token");
    switch (token) {
      case "invalidToken":
        throw new Error("Malformed token");
      case "mockToken":
        return {};
      case "tokenWithInvalidExp":
        return { exp: "invalid" };
      case "tokenWithZeroExp":
        return { exp: 0 };
      case "tokenWithLargeExp":
        return { exp: 9999999999 };
      default:
        return { exp: 1700000000 };
    }
  }),
}));

const createMockResponse = (headers: Record<string, string>) => ({
  headers: {
    get: (name: string) => headers[name] ?? null,
  },
});

describe("getAuthCookie", () => {
  const mockAccessToken = "mockAccessToken";
  const mockRefreshToken = "mockRefreshToken";
  const mockExpDate = new Date(1700000000 * 1000);

  const setCookieHeader = `${AUTH_COOKIE}=${mockAccessToken}; Path=/; Secure; HttpOnly, ${REFRESH_COOKIE}=${mockRefreshToken}; Path=/; Secure; HttpOnly`;

  it("returns undefined when Set-Cookie header is missing", () => {
    const response = createMockResponse({});
    expect(getAuthCookie(response as Response)).toBeUndefined();
  });

  it("returns tokens with correct metadata from Set-Cookie header", () => {
    const response = createMockResponse({ "Set-Cookie": setCookieHeader });
    expect(getAuthCookie(response as Response)).toEqual({
      accessToken: {
        name: AUTH_COOKIE,
        value: mockAccessToken,
        secure: true,
        httpOnly: true,
        expires: mockExpDate,
        domain: undefined,
        path: "/",
        sameSite: undefined,
      },
      refreshToken: {
        name: REFRESH_COOKIE,
        value: mockRefreshToken,
        secure: true,
        httpOnly: true,
        expires: mockExpDate,
        domain: undefined,
        path: "/",
        sameSite: undefined,
      },
    });
  });

  it("returns undefined for missing tokens in Set-Cookie header", () => {
    const response = createMockResponse({
      "Set-Cookie": "SomeOtherCookie=value;",
    });
    expect(getAuthCookie(response as Response)).toEqual({
      accessToken: undefined,
      refreshToken: undefined,
    });
  });

  it("gracefully handles missing expiry in decoded token", () => {
    const response = createMockResponse({ "Set-Cookie": setCookieHeader });
    expect(getAuthCookie(response as Response)).toEqual({
      accessToken: {
        name: AUTH_COOKIE,
        value: mockAccessToken,
        secure: true,
        httpOnly: true,
        expires: mockExpDate,
        domain: undefined,
        path: "/",
        sameSite: undefined,
      },
      refreshToken: {
        name: REFRESH_COOKIE,
        value: mockRefreshToken,
        secure: true,
        httpOnly: true,
        expires: mockExpDate,
        domain: undefined,
        path: "/",
        sameSite: undefined,
      },
    });
  });
});

describe("decodeToken", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns undefined for undefined token", () => {
    expect(decodeToken(undefined as any)).toBeUndefined();
  });

  it("returns undefined for empty token", () => {
    expect(decodeToken("")).toBeUndefined();
  });

  it("returns undefined when token has no exp", () => {
    (jwtDecode as jest.Mock).mockImplementation(() => ({}));
    expect(decodeToken("mockToken")).toBeUndefined();
  });

  it("returns Date object for valid exp", () => {
    const exp = 1700000000;
    (jwtDecode as jest.Mock).mockImplementation(() => ({ exp }));
    expect(decodeToken("mockToken")).toEqual(new Date(exp * 1000));
  });

  it("returns undefined for invalid exp format", () => {
    (jwtDecode as jest.Mock).mockImplementation(() => ({ exp: "invalid" }));
    expect(decodeToken("mockToken")).toBeUndefined();
  });

  it("returns Date(0) for exp = 0", () => {
    (jwtDecode as jest.Mock).mockImplementation(() => ({ exp: 0 }));
    expect(decodeToken("mockToken")).toEqual(new Date(0));
  });

  it("handles very large exp values", () => {
    const exp = 9999999999;
    (jwtDecode as jest.Mock).mockImplementation(() => ({ exp }));
    expect(decodeToken("mockToken")).toEqual(new Date(exp * 1000));
  });

  it("returns undefined if jwtDecode throws", () => {
    (jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error("Malformed token");
    });
    expect(decodeToken("invalidToken")).toBeUndefined();
  });
});
