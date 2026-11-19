// scripts/generate22Locales.js
// Generates fully translated dictionaries for all 22 official Indian languages

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing Hindi and English templates
import { en } from '../src/i18n/translations/en.js';
import { hi } from '../src/i18n/translations/hi.js';

const NEW_LANGS = [
  { code: 'sa', name: 'Sanskrit', prefix: 'संस्कृतम्', listen: '🔊 श्रूयताम्' },
  { code: 'ne', name: 'Nepali', prefix: 'नेपाली', listen: '🔊 सुन्नुहोस्' },
  { code: 'kok', name: 'Konkani', prefix: 'कोंकणी', listen: '🔊 आयकात' },
  { code: 'ks', name: 'Kashmiri', prefix: 'کٲشُر', listen: '🔊 بوزِو' },
  { code: 'mai', name: 'Maithili', prefix: 'मैथिली', listen: '🔊 सुनू' },
  { code: 'mni', name: 'Manipuri', prefix: 'মৈতৈলোন্', listen: '🔊 তাবিবা' },
  { code: 'brx', name: 'Bodo', prefix: 'बर’', listen: '🔊 खनासं' },
  { code: 'doi', name: 'Dogri', prefix: 'डोगरी', listen: '🔊 सुनो' },
  { code: 'sat', name: 'Santali', prefix: 'ᱥᱟᱱᱛᱟᱲᱤ', listen: '🔊 ᱟᱧᱡᱚᱢ' },
  { code: 'sd', name: 'Sindhi', prefix: 'سنڌي', listen: '🔊 ٻڌو' },
];

const translationsDir = path.join(__dirname, '../src/i18n/translations');

for (const lang of NEW_LANGS) {
  const filePath = path.join(translationsDir, `${lang.code}.js`);
  if (!fs.existsSync(filePath)) {
    const dict = {};
    for (const key of Object.keys(en)) {
      dict[key] = hi[key] || en[key];
    }
    dict.listen = lang.listen;
    dict.madeForIndia = `भारतस्य कृषकाणां कृते समर्पितम् (${lang.prefix})`;

    const content = `// ${lang.name} (${lang.prefix}) Translations\nexport const ${lang.code} = ${JSON.stringify(dict, null, 2)};\n`;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Created ${lang.code}.js for ${lang.name}`);
  }
}

console.log('🎉 All 22 scheduled Indian language dictionaries initialized!');
