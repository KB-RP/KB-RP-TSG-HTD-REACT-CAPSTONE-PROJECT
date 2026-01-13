import { getYoutubeVideoId } from './helper';

describe('getYoutubeVideoId', () => {
  test('returns empty string when url is empty', () => {
    expect(getYoutubeVideoId('')).toBe('');
    expect(getYoutubeVideoId(null)).toBe('');
    expect(getYoutubeVideoId(undefined)).toBe('');
  });

  test('extracts video ID from standard YouTube URL', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(getYoutubeVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  test('extracts video ID from shortened youtu.be URL', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    expect(getYoutubeVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  test('extracts video ID from embed URL', () => {
    const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    expect(getYoutubeVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  test('extracts video ID from URL with extra parameters', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s';
    expect(getYoutubeVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  test('returns empty string for invalid YouTube URL', () => {
    const url = 'https://www.youtube.com/watch?v=invalid';
    expect(getYoutubeVideoId(url)).toBe('');
  });

  test('returns empty string for non-YouTube URL', () => {
    const url = 'https://example.com/video';
    expect(getYoutubeVideoId(url)).toBe('');
  });
});
