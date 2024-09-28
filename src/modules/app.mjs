import { chromium } from 'playwright';
import data from './data.mjs';
import { createExcelFile } from './excel.mjs';
import { advancedSearch } from './advanced_search.mjs';
import { extraction } from './extraction.mjs';
import { ranking } from './ranking.mjs';
import { respond } from './respond.mjs';

// НАЧАЛО--------------------------------------------------------------------------------------------------------------------------------------------------------------=> Менять в зависимости от виртуалки/локалки.
import './kill_chrome.mjs';

let skippedVacancies = [];
let appliedVacancies = [];

function addSkippedVacancy(vacancy) {
    skippedVacancies.push(vacancy);
}

function addAppliedVacancy(vacancy) {
    appliedVacancies.push(vacancy);
}

(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Дилей на 2 секунды для завершения процессов хрома.

    console.log('Открываем браузер...');
    let context;
    try {
        context = await chromium.launchPersistentContext(data.userDataDir, { // Путь к файлу пользователя в Google Chrome.
            headless: data.headless, // Режим с отображением браузера.
            executablePath: data.executablePath // Путь к файлу запуска Google Chrome.
        });

        const page = await context.newPage();
        page.setDefaultTimeout(30000); // Установка таймаутов по умолчанию 30 секунд.
        page.setDefaultNavigationTimeout(30000); // Установка таймаутов по умолчанию 30 секунд.
        console.log('Переходим на hh.ru...');
        await page.goto('https://hh.ru/', { waitUntil: 'domcontentloaded' });

        await advancedSearch(page); // Расширенный поиск.

        const vacancies = await extraction(page); // Извлеченные вакансии.

        const order = ranking(vacancies); // Ранжирование вакансий.

        const { skippedDueToTitle } = await respond(vacancies, page, addSkippedVacancy, addAppliedVacancy); // Отклик на вакансии.

        console.log(`Пропустили вакансий из-за названия: ${skippedDueToTitle}`);

        console.log(`Всего откликнулись на ${appliedVacancies.length} вакансий.`);
        
        await createExcelFile(skippedVacancies, appliedVacancies, vacancies); // Создание Excel файла.
        
        console.log('Программа успешно завершена.');
    } catch (error) {
        console.error('Произошла ошибка:', error);
    
    } finally {
        if (context) {
            await context.close();
            console.log('Браузер закрыт.');
        }
    }
})();
