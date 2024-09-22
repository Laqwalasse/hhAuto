import puppeteer from 'puppeteer';
import settings from './settings.mjs';
import { createExcelFile } from './excel.mjs';
import { advancedSearch } from './advanced_search.mjs';
import { extraction } from './extraction.mjs';
import { respond } from './respond.mjs';

//НАЧАЛО--------------------------------------------------------------------------------------------------------------------------------------------------------------=> Менять в зависимости от виртуалки/локалки.
import './kill_chrome.mjs';

// Начало функции.

let skippedVacancies = [];
let appliedVacancies = [];

function addSkippedVacancy(vacancy) {
    skippedVacancies.push(vacancy);
}

function addAppliedVacancy(vacancy) {
    appliedVacancies.push(vacancy);
}

(async () => { // А ЗАЧЕМ ТУТ СКОБКИ В НАЧАЛЕ? И В КОНЦЕ ДОКА ТОЖЕ ЛИШНИЕ КАК БУДТО. НАДО ПРОВЕРИТЬ.
    await new Promise(resolve => setTimeout(resolve, 5000)); // Этот дилей на 5 секунд относится к блоку завершения процессов хрома, но я не могу его туда включить, потому что промисы можно только в асинк вставлять.
    const browser = await puppeteer.launch({
        headless: settings.headless,
        userDataDir: settings.userDataDir, // Профиль пользователя Google Chrome.
        executablePath: settings.executablePath // Путь к файлу запуска Google Chrome.
    });

    console.log('Открываем браузер...');
    try {
        const page = await browser.newPage();
        page.setDefaultTimeout(60000); // Ставим по умолчанию таймауты 1 минуту, чтобы все элементы успевали загрузиться.
        page.setDefaultNavigationTimeout(60000); // Ставим по умолчанию таймауты 1 минуту, чтобы все элементы успевали загрузиться.
        console.log('Переходим на hh.ru...');
        await page.goto('https://hh.ru/');
//КОНЕЦ--------------------------------------------------------------------------------------------------------------------------------------------------------------=> Менять в зависимости от виртуалки/локалки. 
        const jobTitlesArray = await advancedSearch(page); // Расширенный поиск и передача массива для работы ranking.js

        console.log('Включаем расширенное описание вакансий...');
        const fullDescription = 'button[data-qa="full_description"]';
        await page.click(fullDescription);

        const vacancies = await extraction(page); // Извлечение вакансий.
//--------------------------------------------------------Начало блока
        console.log('Ранжирование вакансий по опыту и должностям...');
        const experienceOrder = settings.experienceOrder;

        vacancies.sort((a, b) => {
            const experienceComparison = (experienceOrder[a.experience] || 5) - (experienceOrder[b.experience] || 5);
            if (experienceComparison !== 0) return experienceComparison;

            const titleAIndex = jobTitlesArray.findIndex(title => a.title.toLowerCase().includes(title.toLowerCase()));
            const titleBIndex = jobTitlesArray.findIndex(title => b.title.toLowerCase().includes(title.toLowerCase()));
            return titleAIndex - titleBIndex;
        });
//--------------------------------------------------------Конец блока

        const { skippedDueToTitle } = await respond(vacancies, jobTitlesArray, page, addSkippedVacancy, addAppliedVacancy); // Отклик на вакансии.

        console.log(`Пропустили вакансий из-за названия: ${skippedDueToTitle}`);
        console.log(`Всего откликнулись на ${appliedVacancies.length} вакансий.`);
        
        await createExcelFile(skippedVacancies, appliedVacancies); // Вызов Excel функции для создания файла.
        
        console.log('Программа успешно завершена.');
    } catch (error) {
        console.error('Произошла ошибка:', error);
    } finally {
        await browser.close();
    }
})();