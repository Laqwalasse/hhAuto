import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data.json');

console.log('Парсим данные из data.json...');
let data;
try {
    const dataJSON = fs.readFileSync(dataPath, 'utf-8');
    data = JSON.parse(dataJSON);
} catch (error) {
    console.error('Ошибка при чтении файла настроек:', error);
}

// ТЕСТИРОВАНИЕ.
// console.log('Загруженные параметры из data.json:');
// Object.entries(data).forEach(([key, value]) => {
//     console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
// });

export default data;
