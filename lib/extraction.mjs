import settings from './settings.mjs';

        export async function extraction(page) {
            console.log('Извлекаем вакансии...');
            const vacancies = [];
            const nextPageButton = '[data-qa="number-pages-next"]'; // Поменяли структуру? 'a[data-qa="pager-next"]'
            for (let pageNum = 1; pageNum <= settings.pageNum; pageNum++) { // Максимальное количество страниц, с которых хотим извлечь вакансии для поиска.
                const pageVacancies = await page.evaluate(() => {
                    const elements = document.querySelectorAll('[data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_standard_plus vacancy-serp-item-clickme"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_premium"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_free"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_standard"], [data-qa="vacancy-serp__vacancy vacancy-serp__vacancy_standard_plus"]'); // Это типы вакансий по селекторам.
                    return Array.from(elements).map(element => {
                        const titleElement = element.querySelector('[data-qa="bloko-header-2"]');
                        const descriptionElement = element.querySelector('[data-qa="vacancy-serp__vacancy_snippet_responsibility"], [data-qa="vacancy-serp__vacancy_snippet_requirement"]');
                        const experienceElement = element.querySelector('[data-qa="vacancy-serp__vacancy-work-experience"]');
                        const title = titleElement ? titleElement.innerText.trim() : '';
                        const linkElement = titleElement ? titleElement.querySelector('a') : null;
                        const link = linkElement ? linkElement.href : '';
                        const description = descriptionElement ? descriptionElement.innerText.trim() : '';
                        const experience = experienceElement ? experienceElement.innerText.trim() : '';
                        return { title, link, description, experience };
                    });
                });
                
                vacancies.push(...pageVacancies);

                while (true) {
                    try {
                        await page.waitForSelector(nextPageButton, { visible: true, timeout: 1000 });
                        const nextPageExists = await page.$(nextPageButton) !== null;
                        if (nextPageExists) {
                            await page.click(nextPageButton);
                            await page.waitForNavigation({ timeout: 1000 });
                        } else {
                            break;
                        }
                    } catch (error) {
                        if (error.name !== 'TimeoutError') {
                            console.error('Ошибка при попытке нажать на кнопку или дождаться навигации:', error);
                        }
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } 
            }
            console.log(`Всего вакансий извлечено: ${vacancies.length}`);
            
            return vacancies;
        }