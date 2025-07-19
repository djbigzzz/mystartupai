import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: RequestInit & { body?: any }
): Promise<any> {
  const { body, ...restOptions } = options || {};
  
  const fetchOptions: RequestInit = {
    credentials: "include",
    ...restOptions
  };

  // If body is provided and it's an object, stringify it and set content-type
  if (body && typeof body === 'object') {
    fetchOptions.body = JSON.stringify(body);
    fetchOptions.headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers
    };
  } else if (body) {
    fetchOptions.body = body;
  }

  // Security: Never log request bodies as they may contain sensitive data
  if (process.env.NODE_ENV === 'development') {
    console.log(`API Request to ${url}:`, { method: fetchOptions.method || 'GET' });
  }

  const res = await fetch(url, fetchOptions);

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
