"use client";

export default function DashboardPage() {
  // const { isLoading } = useRoleRedirect();

  // if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  // }

  // This component will redirect based on role, so it shouldn't render anything
  return null;
}
