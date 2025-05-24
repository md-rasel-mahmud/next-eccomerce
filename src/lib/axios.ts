import axios from "axios";
import { toast } from "sonner";

const axiosRequest = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  withCredentials: true,
});

// Response Interceptor
axiosRequest.interceptors.response.use(
  (response) => {
    // GET requests do not show success toast
    if (response.config.method !== "get") {
      toast.success("Success", {
        duration: 3000,
        description: response.data.message || "Request was successful",
      });
    }
    return response;
  },
  (error) => {
    const method = error.config?.method;

    if (method !== "get") {
      const message = error.response?.data?.message || "Something went wrong";

      toast.error("Error", {
        duration: 3000,
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosRequest;
