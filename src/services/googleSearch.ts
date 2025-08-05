// Google Custom Search Service for JEE Mock Test
export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

interface GoogleSearchConfig {
  apiKey: string;
  searchEngineId: string;
}

export class GoogleSearchService {
  private apiKey: string = '';
  private searchEngineId: string = '';

  constructor(config?: GoogleSearchConfig) {
    if (config) {
      this.setConfig(config);
    }
  }

  setConfig({ apiKey, searchEngineId }: GoogleSearchConfig) {
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.searchEngineId;
  }

  async search(query: string, maxResults: number = 3): Promise<SearchResult[]> {
    if (!this.isConfigured()) {
      console.warn('Google Search not configured, skipping search');
      return [];
    }

    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1');
    searchUrl.searchParams.append('key', this.apiKey);
    searchUrl.searchParams.append('cx', this.searchEngineId);
    searchUrl.searchParams.append('q', query + ' JEE IIT हिंदी');
    searchUrl.searchParams.append('num', maxResults.toString());
    searchUrl.searchParams.append('hl', 'hi');

    try {
      const response = await fetch(searchUrl.toString());
      
      if (response.status >= 500) {
        // Retry once on server error
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retryResponse = await fetch(searchUrl.toString());
        if (!retryResponse.ok) {
          throw new Error('Search service temporarily unavailable');
        }
        return this.parseSearchResults(await retryResponse.json());
      }

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSearchResults(data);
    } catch (error: any) {
      console.error('Google Search Error:', error);
      
      if (error.message.includes('5')) {
        console.warn('Search service error, falling back to AI only');
        return [];
      }
      
      throw new Error('खोज सेवा में त्रुटि। कृपया पुनः प्रयास करें।');
    }
  }

  private parseSearchResults(data: any): SearchResult[] {
    if (!data.items) return [];

    return data.items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    }));
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.search('JEE test query', 1);
      return true;
    } catch {
      return false;
    }
  }
}

export const googleSearchService = new GoogleSearchService();