const BASE_URL = 'https://dummyjson.com';

export const httpClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    // Обов'язково додаємо BASE_URL до нашого endpoint (наприклад, /todos)
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
