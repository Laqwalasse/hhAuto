import data from './data.mjs';

export async function advancedSearch(page) {
    console.log('Открываем расширенный поиск...');
    const advancedSearchButton = '[data-qa="advanced-search"]'; 
    await page.waitForSelector(advancedSearchButton);
    await page.click(advancedSearchButton);

    await page.waitForTimeout(2000);

    console.log('Ввод должностей...');
    const jobTitlesArray = data.jobTitles.join(' OR ');
    const vacancyInputSelector = 'input[data-qa="vacancysearch__keywords-input"]';
    await page.fill(vacancyInputSelector, jobTitlesArray);

    console.log('Ввод слов-исключений...');
    const exclusionWords = data.exclusionWords.join(', ');
    const excludedInputSelector = 'input[data-qa="vacancysearch__keywords-excluded-input"]';
    await page.fill(excludedInputSelector, exclusionWords);

    console.log('Выбор отрасли компаний...');
    const fieldSelectorList = 'button[data-qa="industry-addFromList"]';
    await page.waitForSelector(fieldSelectorList);
    await page.click(fieldSelectorList);

    const selectField = async (selector) => {
        await page.waitForSelector(selector, { state: 'visible' });
    
        const isVisible = await page.isVisible(selector);
        const isEnabled = await page.isEnabled(selector);
        if (isVisible && isEnabled) {
            await page.click(selector, { force: true });
        } else {
            console.error(`Чекбокс ${selector} не доступен для клика.`);
        }
    };
    
    const fieldSelectors = data.fieldSelectors;
    for (const code1 of fieldSelectors) {
        await selectField(`[data-qa="bloko-tree-selector-input bloko-tree-selector-input-${code1}"]`); 
    }

    const fieldSelectorSubmit = 'button[data-qa="bloko-tree-selector-popup-submit"]';
    await page.click(fieldSelectorSubmit);

    console.log('Выбираем страны для поиска...');
    const geoSelectorList = 'button[data-qa="advanced-search-region-selectFromList"]';
    await page.waitForSelector(geoSelectorList);
    await page.click(geoSelectorList);

    const selectCountry = async (selector) => {
        await page.waitForSelector(selector);
        const isCountryChecked = await page.isChecked(selector);
        if (!isCountryChecked) {
            await page.click(selector);
        }
    };
    const countrySelectors = data.countrySelectors;
    for (const code2 of countrySelectors) {
        await selectCountry(`[data-qa="bloko-tree-selector-input bloko-tree-selector-input-${code2}"]`);
    }

    const geoSelectorSubmit = 'button[data-qa="bloko-tree-selector-popup-submit"]';
    await page.click(geoSelectorSubmit);

    console.log('Нажимаем поиск...');
    const advancedSearchSubmit = 'button[data-qa="advanced-search-submit-button"]';
    await page.click(advancedSearchSubmit);
    
    console.log('Включаем расширенное описание вакансий...');
    const fullDescription = 'button[data-qa="full_description"]';
    await page.click(fullDescription);

}
