import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import type { TextPageConfig } from '@/types/page';

const DEFAULT_CONTENT_DIR = 'content';

function normalizeLocale(locale: string): string {
  return locale.trim().replace('_', '-').toLowerCase();
}

function getCandidateFilePaths(filename: string, locale?: string): string[] {
  const candidates: string[] = [];

  if (locale) {
    candidates.push(path.join(process.cwd(), `${DEFAULT_CONTENT_DIR}_${normalizeLocale(locale)}`, filename));
  }

  candidates.push(path.join(process.cwd(), DEFAULT_CONTENT_DIR, filename));

  return candidates;
}

function readFirstAvailableFile(filename: string, locale?: string): string {
  const candidates = getCandidateFilePaths(filename, locale);

  for (const filePath of candidates) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Error loading file ${filePath}:`, error);
      }
    }
  }

  if (locale) {
    console.warn(`Missing localized file \"${filename}\" for locale \"${locale}\", and no fallback found in content/.`);
  } else {
    console.warn(`Missing file \"${filename}\" in content/.`);
  }

  return '';
}

export function getMarkdownContent(filename: string, locale?: string): string {
  return readFirstAvailableFile(filename, locale);
}

export function getTextPageContent(config: TextPageConfig, locale?: string): string {
  if (!config.download_directory) return getMarkdownContent(config.source, locale);
  const publicRoot = path.resolve(process.cwd(), 'public');
  const directory = path.resolve(publicRoot, config.download_directory);
  const relative = path.relative(publicRoot, directory);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Download directory must be inside public/');
  const chinese = locale?.startsWith('zh');
  let files: string[];
  try {
    files = fs.readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isFile() && !entry.name.startsWith('~$') && /\.(docx|doc)$/i.test(entry.name))
      .map(entry => entry.name).sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    files = [];
  }
  if (!files.length) return chinese ? '暂无简历文件。' : 'No CV file available yet.';
  return files.map(filename => {
    const url = '/' + path.join(relative, filename).split(path.sep).map(encodeURIComponent).join('/');
    const label = files.length === 1 ? (chinese ? '中文简历' : 'English CV') : filename.replace(/\.(docx|doc)$/i, '').replace(/[\[\]\\]/g, '\\$&');
    return `- [${label}](${url})`;
  }).join('\n');
}

export function getBibtexContent(filename: string, locale?: string): string {
  return readFirstAvailableFile(filename, locale);
}

export function getTomlContent<T>(filename: string, locale?: string): T | null {
  const content = readFirstAvailableFile(filename, locale);
  if (!content) {
    return null;
  }

  try {
    return parse(content) as unknown as T;
  } catch (error) {
    console.error(`Error parsing TOML file ${filename}:`, error);
    return null;
  }
}

export function getPageConfig<T = unknown>(pageName: string, locale?: string): T | null {
  return getTomlContent<T>(`${pageName}.toml`, locale);
}
