import { CryptoUtil } from './crypto-util.class';

export class UrlUtil {
  public static normalize(urlString: string) {
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    url.search = '';
    const newSearchParams = new URLSearchParams();
    const searchParamsEntries = Array.from(searchParams.entries());
    const newSearchParamsEntries: [string, string[]][] = searchParamsEntries
      .map(([key]) => key)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => [key, []]);

    searchParamsEntries.forEach(([key, value]) => {
      newSearchParamsEntries.find(([k]) => k === key)![1].push(value);
    });

    newSearchParamsEntries.forEach(([key, values]) => {
      values.forEach((value) => {
        newSearchParams.append(key, value);
      });
    });

    url.search = newSearchParams.toString();

    return url.toString();
  }

  public static async hash(urlString: string) {
    return await CryptoUtil.sha256Hex(UrlUtil.normalize(urlString));
  }
}
