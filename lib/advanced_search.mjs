import settings from './settings.mjs';

        export async function advancedSearch(page) {
            console.log('Открываем расширенный поиск...');
            const advancedSearchButton = '[data-qa="advanced-search"]'; // "a.bloko-button.bloko-button_icon-only" — они поменяли структуру элемента, теперь это вроде как не нужно.
            await page.waitForSelector(advancedSearchButton);
            await page.click(advancedSearchButton);

            await new Promise(resolve => setTimeout(resolve, 2000)); // Если слишком быстро загружается, то не успевает увидеть селектор поля ввода следующего блока и завершает работу.
            
            console.log('Ввод должностей...');
            const jobTitlesArray = settings.jobTitles.split(',').map(title => title.trim());
            const jobTitlesString = jobTitlesArray.join(' OR ');
            const vacancyInputSelector = 'input[data-qa="vacancysearch__keywords-input"]';
            await page.type(vacancyInputSelector, jobTitlesString);

            console.log('Ввод слов-исключений...');
            const exclusionWords = settings.exclusionWords;
            const excludedInputSelector = 'input[data-qa="vacancysearch__keywords-excluded-input"]';
            await page.type(excludedInputSelector, exclusionWords);

            console.log('Выбор отрасли компаний...');
            const fieldSelectorList = 'button[data-qa="industry-addFromList"]';
            await page.waitForSelector(fieldSelectorList);
            await page.click(fieldSelectorList);

            const selectField = async (selector) => {
                await page.waitForSelector(selector);
                const isFieldChecked = await page.$eval(selector, checkbox => checkbox.checked);
                if (!isFieldChecked) {
                    await page.click(selector);
                }
            };
            const fieldSelectors = settings.fieldSelectors.split(',').map(code => code.trim());
            for (const code1 of fieldSelectors) {
                await selectField(`[data-qa="bloko-tree-selector-input bloko-tree-selector-input-${code1}"]`); 
            }

            const fieldSelectorSubmit = 'button[data-qa="bloko-tree-selector-popup-submit"]';
            await page.click(fieldSelectorSubmit);

            console.log('Выбираем страны для поиска...');
            const geoSelectorList = 'button[data-qa="advanced-search-region-selectFromList"]';
            await page.waitForSelector(geoSelectorList);
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, geoSelectorList);

            const selectCountry = async (selector) => {
                await page.waitForSelector(selector);
                const isCountryChecked = await page.$eval(selector, checkbox => checkbox.checked);
                if (!isCountryChecked) {
                    await page.click(selector);
                }
            };
            const countrySelectors = settings.countrySelectors.split(',').map(code => code.trim());
            for (const code2 of countrySelectors) {
                await selectCountry(`[data-qa="bloko-tree-selector-input bloko-tree-selector-input-${code2}"]`);
            }

            const geoSelectorSubmit = 'button[data-qa="bloko-tree-selector-popup-submit"]';
            await page.click(geoSelectorSubmit);

            console.log('Нажимаем поиск...');
            const advancedSearchSubmit = 'button[data-qa="advanced-search-submit-button"]';
            await page.click(advancedSearchSubmit);
            await page.waitForNavigation();

            return jobTitlesArray;
        }