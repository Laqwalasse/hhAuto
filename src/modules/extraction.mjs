import data from './data.mjs';

export async function extraction(page) {
    console.log('Извлекаем вакансии...');
    const vacancies = [];
    const nextPageButton = '[data-qa="number-pages-next"]'; // Кнопка следующей страницы.

    for (let pageNum = 1; pageNum <= data.pageNum; pageNum++) { // Максимальное количество страниц.
        const pageVacancies = await page.evaluate(() => {
            const elements = document.querySelectorAll('[data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_standard_plus vacancy-serp-item-clickme"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_premium"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_free"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_standard"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_standard_plus"]');
            return Array.from(elements).map(element => { // Ищем элемент по селектору => ?. проверка на undefined => trim() удаляет лишние пробелы => || ' ' делает строку пустой, если получаем undefined.
                const title = (element.querySelector('[data-qa="bloko-header-2"]')?.innerText.trim() || '');
                const link = (element.querySelector('[data-qa="bloko-header-2"]')?.querySelector('a')?.href || '');
                const description = (element.querySelector('[data-qa="vacancy-serp__vacancy_snippet_responsibility"], [data-qa="vacancy-serp__vacancy_snippet_requirement"]')?.innerText.trim() || '');
                const experience = (element.querySelector('.magritte-tag__label___YHV-o_3-0-13')?.innerText.trim() || '');
                return { title, link, description, experience };
            });
        });

        vacancies.push(...pageVacancies);

        // ТЕСТИРОВАНИЕ. Идёт проверка только самой первой извлечённой вакансии.
        // if (vacancies.length > 0) {
        //     const firstVacancy = vacancies[0];
        //     console.log('Первая извлеченная вакансия:');
        //     console.log(`Заголовок: ${firstVacancy.title}`);
        //     console.log(`Ссылка: ${firstVacancy.link}`);
        //     console.log(`Описание: ${firstVacancy.description}`);
        //     console.log(`Опыт: ${firstVacancy.experience}`);
        // }

        try {
            await page.waitForSelector(nextPageButton, { state: 'visible', timeout: 1500 });
            await page.click(nextPageButton);
            await page.waitForTimeout(1500);
        } catch (error) {
            console.error('Ошибка при переходе на следующую страницу:', error);
            break;
        }
    }

    console.log(`Всего вакансий извлечено: ${vacancies.length}`);
    
    return vacancies;
}
