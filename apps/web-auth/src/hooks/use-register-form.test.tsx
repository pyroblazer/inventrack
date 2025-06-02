//apps/web-auth/src/hooks/use-register-form.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useRegisterForm } from "./use-register-form";
import { toast } from "sonner";
import registerUser from "@/actions/register-user";

// Mock dependencies
jest.mock("sonner", () => ({
  toast: {
    promise: jest.fn(),
  },
}));

jest.mock("@/actions/register-user");

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;

describe("useRegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should initialize form with default values", () => {
    const { result } = renderHook(() => useRegisterForm());

    expect(result.current.form.getValues()).toEqual({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSubmitButtonBlocked).toBe(true);
  });

  it("should call registerUser on submit with correct values", async () => {
    // Mock the registerUser to resolve successfully
    (registerUser as jest.Mock).mockResolvedValue({ success: true });

    // Mock toast.promise to return a thenable object
    const mockPromise = {
      unwrap: jest.fn().mockImplementation(() => ({
        then: jest.fn().mockImplementation((callback) => {
          callback(); // Execute the then callback
          return {
            finally: jest.fn().mockImplementation((finalCallback) => {
              finalCallback(); // Execute the finally callback
              return Promise.resolve();
            }),
          };
        }),
      })),
    };

    (toast.promise as jest.Mock).mockReturnValue(mockPromise);

    const { result } = renderHook(() => useRegisterForm());
    const values = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    await act(async () => {
      await result.current.onSubmit(values);
    });

    expect(toast.promise).toHaveBeenCalledWith(expect.any(Promise), {
      success: "Registration successful!",
      loading: "Registering...",
      error: "Failed to register!",
    });
    expect(registerUser).toHaveBeenCalledWith(values);
    expect(mockPromise.unwrap).toHaveBeenCalled();
    // The then and finally callbacks are called internally, not directly on our mocks
  });

  it("should reset form and set isPending to false on successful registration", async () => {
    const mockFinally = jest.fn().mockImplementation((callback) => {
      callback();
      return Promise.resolve();
    });
    const mockThen = jest.fn().mockImplementation((callback) => {
      callback();
      return { finally: mockFinally };
    });
    const mockUnwrap = jest.fn().mockReturnValue({ then: mockThen });

    (toast.promise as jest.Mock).mockReturnValue({ unwrap: mockUnwrap });
    (registerUser as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useRegisterForm());
    const values = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    // Set form values first
    act(() => {
      result.current.form.setValue("username", values.username);
      result.current.form.setValue("email", values.email);
      result.current.form.setValue("password", values.password);
      result.current.form.setValue("confirmPassword", values.confirmPassword);
    });

    await act(async () => {
      await result.current.onSubmit(values);
    });

    // Verify form was reset after successful submission
    expect(result.current.form.getValues()).toEqual({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    expect(result.current.isPending).toBe(false);
  });

  it("should set isPending to false on registration failure", async () => {
    // Mock registerUser to reject
    (registerUser as jest.Mock).mockRejectedValue("Registration failed");

    // Mock toast.promise to handle the rejection properly
    (toast.promise as jest.Mock).mockImplementation((promise) => {
      // Return an object with unwrap that returns the original promise
      return {
        unwrap: () => promise,
      };
    });

    const { result } = renderHook(() => useRegisterForm());
    const values = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    // Use a try/catch block to handle the expected rejection
    await act(async () => {
      try {
        await result.current.onSubmit(values);
      } catch (error) {
        // Expected error - do nothing
      }
    });

    expect(toast.promise).toHaveBeenCalled();
    expect(registerUser).toHaveBeenCalledWith(values);
    expect(result.current.isPending).toBe(false);
  });

  it("should block submit button if form is invalid", async () => {
    const { result } = renderHook(() => useRegisterForm());

    // Initially should be blocked (empty form)
    expect(result.current.isSubmitButtonBlocked).toBe(true);

    // Fill partial form - should still be blocked
    await act(async () => {
      result.current.form.setValue("username", "testuser");
      result.current.form.setValue("email", "test@example.com");
    });

    expect(result.current.isSubmitButtonBlocked).toBe(true);

    // Fill complete form - should not be blocked
    await act(async () => {
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
    });

    expect(result.current.isSubmitButtonBlocked).toBe(false);
  });

  it("should block submit button if passwords do not match", async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      result.current.form.setValue("username", "testuser");
      result.current.form.setValue("email", "test@example.com");
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "differentpassword");

      // Trigger validation
      await result.current.form.trigger();
    });

    // The form should be blocked due to validation errors
    expect(result.current.isSubmitButtonBlocked).toBe(true);
  });

  it("should set isPending to true during submission", async () => {
    let resolvePending: () => void;
    const pendingPromise = new Promise<void>((resolve) => {
      resolvePending = resolve;
    });

    const mockFinally = jest.fn().mockImplementation((callback) => {
      callback();
      return Promise.resolve();
    });
    const mockThen = jest.fn().mockImplementation((callback) => {
      callback();
      return { finally: mockFinally };
    });
    const mockUnwrap = jest.fn().mockReturnValue({ then: mockThen });

    (toast.promise as jest.Mock).mockReturnValue({ unwrap: mockUnwrap });
    (registerUser as jest.Mock).mockImplementation(() => pendingPromise);

    const { result } = renderHook(() => useRegisterForm());
    const values = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    // Start submission
    act(() => {
      result.current.onSubmit(values);
    });

    // Should be pending
    expect(result.current.isPending).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolvePending!();
      await pendingPromise;
    });

    // Should no longer be pending
    expect(result.current.isPending).toBe(false);
  });
});
