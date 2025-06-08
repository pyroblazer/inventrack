//apps/web-auth/src/hooks/use-login-form.test.tsx
import { type JSX } from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { type z } from "zod";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoginForm } from "@/hooks/use-login-form";
import { type loginFormSchema } from "@/schemas/login-schema";
import loginUser from "@/actions/login-user";
// Mock the toast and loginUser modules
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn().mockReturnValue("login"),
  },
}));
jest.mock("@/actions/login-user", () => jest.fn());

const queryClient = new QueryClient();

describe("useLoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  function TestComponent(): JSX.Element {
    const { form, isSubmitDisabled, handleSubmit } = useLoginForm();

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <input
          {...form.register("email")}
          placeholder="email"
          data-testid="email"
        />
        <input
          {...form.register("password")}
          placeholder="password"
          data-testid="password"
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          data-testid="submit-button"
        >
          Submit
        </button>
      </form>
    );
  }

  const wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should initialize form with default values", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    expect(result.current.form.getValues()).toEqual({
      email: "",
      password: "",
    });
  });

  it("should call loginUser on submit with correct values", async () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    const values = { email: "test@example.com", password: "password123" };

    await act(async () => {
      result.current.handleSubmit(values as z.infer<typeof loginFormSchema>);
    });

    expect(toast.loading).toHaveBeenCalledWith("Logging in...", {
      id: "login",
    });
    expect(loginUser).toHaveBeenCalledWith(values);
  });

  it("should show success toast on successful login", async () => {
    (loginUser as jest.Mock).mockResolvedValueOnce({});
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    const values = { email: "test@example.com", password: "password123" };

    await act(async () => {
      result.current.handleSubmit(values as z.infer<typeof loginFormSchema>);
    });

    expect(toast.success).toHaveBeenCalledWith("Logged in successfully", {
      id: "login",
    });
  });

  it("should show error toast on login failure", async () => {
    const errorMessage = "Invalid credentials";
    (loginUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    const values = { email: "test@example.com", password: "wrongpassword" };

    await act(async () => {
      result.current.handleSubmit(values as z.infer<typeof loginFormSchema>);
    });

    expect(toast.error).toHaveBeenCalledWith(errorMessage, {
      id: "login",
    });
  });

  it("should disable submit button if form is invalid", () => {
    render(<TestComponent />, { wrapper });

    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(submitButton).toBeDisabled(); // The button should be disabled initially
  });

  it("should enable submit button if form is valid", async () => {
    render(<TestComponent />, { wrapper });

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled(); // The button should be enabled if the form is valid
    });
  });
});
