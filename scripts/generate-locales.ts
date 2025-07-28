// scripts/generate-locales.ts
import fs from 'fs';
import path from 'path';
import { LanguageData } from '../src/constants/language-data';
import { fileURLToPath } from 'url';

const en: Record<string, string> = {};
const vi: Record<string, string> = {};

for (const group in LanguageData) {
  for (const item in LanguageData[group]) {
    const { key, en: enVal, vi: viVal } = LanguageData[group][item];
    en[key] = enVal || '';
    vi[key] = viVal || '';
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesPath = path.resolve(__dirname, '../src/locales');

if (!fs.existsSync(localesPath)) {
  fs.mkdirSync(localesPath, { recursive: true });
}

fs.writeFileSync(path.join(localesPath, 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(localesPath, 'vi.json'), JSON.stringify(vi, null, 2));

const result: Record<string, Record<string, string>> = {};

for (const group in LanguageData) {
  result[group] = {};
  for (const item in LanguageData[group]) {
    result[group][item] = LanguageData[group][item].key;
  }
}
const listKeys = `// This file is generated automatically. Do not edit manually.
export const LanguageKey = ${JSON.stringify(result, null, 2)} as const;

export type LanguageKeyType = typeof LanguageKey;
`;
fs.writeFileSync(path.join(localesPath, 'key.ts'), listKeys, 'utf-8');
console.log('✅ Generated en.json and vi.json');
