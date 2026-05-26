export const getApiBaseUrl = () => {
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "")
    .trim()
    .replace(/\/+$/, "");

  if (!backendUrl) {
    throw new Error("VITE_BACKEND_URL is not defined in .env file");
  }

  return backendUrl.endsWith("/api") ? backendUrl : `${backendUrl}/api`;
};
