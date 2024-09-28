import data from './data.mjs';

export async function respond(vacancies, page, addSkippedVacancy, addAppliedVacancy) {
    console.log('Отклик на вакансии...');
    const appliedVacancies = [];
    let appliedCount = 0;
    let skippedDueToTitle = 0;

    for (const vacancy of vacancies) {
        if (appliedCount >= data.appliedCount) { // Максимальное количество вакансий, на которые хотим откликнуться.
            break;
        }

        const isRelevant = data.jobTitles.some(title => vacancy.title.toLowerCase().includes(title.toLowerCase()));

        if (!isRelevant) {
            skippedDueToTitle++;
            addSkippedVacancy(vacancy); // Для экселя.
            continue;
        }
        await page.goto(vacancy.link, { waitUntil: 'domcontentloaded' });

        const responseLinkSelector = 'a.bloko-button[data-qa="vacancy-response-link-top"]';
        await page.waitForSelector(responseLinkSelector);
        await page.click(responseLinkSelector);
        await page.waitForTimeout(5000); 

        const resumeSelector = 'div[data-qa="resume-title"]';
        try {
            await page.waitForSelector(resumeSelector);
            const resumeElements = await page.$$(resumeSelector);
            let selectedResume = null;
        
            for (const resume of resumeElements) {
                const resumeText = await resume.evaluate(el => el.innerText);
                if (resumeText.includes(data.resumeText)) {
                    selectedResume = resume;
                    break;
                }
            }
        
            if (selectedResume) {
                const labelElement = await selectedResume.evaluateHandle(el => el.closest('label'));
                if (labelElement) {
                    const radioButton = await labelElement.$('input[type="radio"]');
                    if (radioButton) {
                        await radioButton.click();
                    } else {
                        console.log('Не удалось найти буллет.');
                    }
                } else {
                    console.log('Не удалось найти родительский элемент для резюме.');
                }
        
                const applyPopupButtonSelector = 'button[data-qa="vacancy-response-submit-popup"]';
                await page.waitForSelector(applyPopupButtonSelector);
                await page.click(applyPopupButtonSelector);
        
                appliedVacancies.push(vacancy);
                appliedCount++;
                addAppliedVacancy(vacancy);
            } else {
                console.log('Не найдено подходящее резюме для отклика.');
            }
        } catch (error) {
            console.log('Ошибка: не удалось найти элемент резюме.', error);
        }
    }
return { appliedVacancies, appliedCount, skippedDueToTitle };
}
