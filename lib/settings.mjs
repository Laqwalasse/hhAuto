import fs from 'fs';
import path from 'path';

// Извлечение данных из текстового файла на рабочем столе.

console.log('Получаем настройки для запуска программы...');
const settingsPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', 'settings.txt');
const settings = fs.readFileSync(settingsPath, 'utf-8').split('\n').reduce((acc, line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && trimmedLine.includes('=')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        
        if (key === 'headless') { // Обрабатываем только те ключи, которые ожидаются как булевые или числовые значения.
            acc[key] = (value.toLowerCase() === 'true');
        } else if (key === 'experienceOrder') {
            acc[key] = value.split(',').reduce((expAcc, exp) => {
                const [expKey, expValue] = exp.split(':').map(part => part.trim().replace(/'/g, ''));
                expAcc[expKey] = parseInt(expValue, 10);
                return expAcc;
            }, {});
        } else if (!isNaN(Number(value))) {
            acc[key] = Number(value);
        } else {
            acc[key] = value;
        }
    }
    return acc;
}, {});

if (typeof settings.fieldSelectors !== 'string') { // Проверяем, что fieldSelectors – это строка.
    settings.fieldSelectors = String(settings.fieldSelectors);
}

export default settings;