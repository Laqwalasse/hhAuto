import settings from './settings.mjs';

        export async function respond(vacancies, jobTitlesArray, page, addSkippedVacancy, addAppliedVacancy) {
            console.log('Отклик на вакансии...');
            const appliedVacancies = [];
            let appliedCount = 0;
            let skippedDueToTitle = 0;

            for (let vacancy of vacancies) {
                if (appliedCount >= settings.appliedCount) { // Максимальное количество вакансий, на которые хотим откликнуться.
                    break;
                }

                const isRelevant = jobTitlesArray.some(title => vacancy.title.toLowerCase().includes(title.toLowerCase()));

                if (!isRelevant) {
                    skippedDueToTitle++;
                    addSkippedVacancy(vacancy); // Для экселя.
                    continue;
                }

                await page.goto(vacancy.link);

                const responseLinkSelector = 'a.bloko-button[data-qa="vacancy-response-link-top"]';
                await page.waitForSelector(responseLinkSelector);
                const responseLink = await page.$(responseLinkSelector);
                if (responseLink) {
                    const responseLinkHref = await responseLink.evaluate(link => link.href);
                    await page.goto(responseLinkHref);

                    const resumeSelector = 'span[data-qa="resume-title"]';
                    await page.waitForSelector(resumeSelector);
                    const resumeElements = await page.$$(resumeSelector);
                    let selectedResume = null;
                    for (let resume of resumeElements) {
                        const resumeText = await resume.evaluate(el => el.innerText.trim());

                        if (resumeText.includes(settings.resumeText)) { //Выбор резюме, если у пользователя их несколько.
                            selectedResume = resume;
                            break;
                        }
                    }

                    if (selectedResume) {
                        await selectedResume.click();
                        
                        const applyPopupButtonSelector = 'button.bloko-button_kind-primary[data-qa="vacancy-response-submit-popup"]';
                        await page.waitForSelector(applyPopupButtonSelector);
                        await page.click(applyPopupButtonSelector);
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Время ожидания после отклика на вакансию, для защиты от антидудоса hh.
                        appliedVacancies.push(vacancy); 
                        appliedCount++;
                        addAppliedVacancy(vacancy); // Для экселя.
                    } else {
                        console.log('Не найдено подходящее резюме для отклика.');
                    }
                } else {
                    console.log('Ссылка на отклик не найдена для вакансии:', vacancy.title);
                }
            }
            return { appliedVacancies, appliedCount, skippedDueToTitle };
        }