import data from './data.mjs';

export function ranking(vacancies) {

    console.log('Ранжирование вакансий по опыту и должностям...');

    vacancies.sort((a, b) => {
        const experienceComparison = (data.experienceOrder[a.experience] || 5) - (data.experienceOrder[b.experience] || 5);
        if (experienceComparison !== 0) return experienceComparison;

        const titleAIndex = data.jobTitles.findIndex(title => a.title.toLowerCase().includes(title.toLowerCase()));
        const titleBIndex = data.jobTitles.findIndex(title => b.title.toLowerCase().includes(title.toLowerCase()));
        return titleAIndex - titleBIndex;
    });

    return vacancies;

}

// // ТЕСТИРОВАНИЕ.
// const testVacancies = [
//     { title: 'Junior Fullstack-аналитик', experience: 'Без опыта' },
//     { title: 'Senior Бизнес-аналитик', experience: 'Опыт более 6 лет' },
//     { title: 'Middle Фулстек аналитик', experience: 'Опыт 3-6 лет' },
//     { title: 'Fullstack аналитик', experience: 'Опыт 1-3 года' }
// ];

// const expectedOrder = [
//     { title: 'Fullstack аналитик', experience: 'Опыт 1-3 года' },
//     { title: 'Middle Фулстек аналитик', experience: 'Опыт 3-6 лет' },
//     { title: 'Junior Fullstack-аналитик', experience: 'Без опыта' },
//     { title: 'Senior Бизнес-аналитик', experience: 'Опыт более 6 лет' },
// ];

// const result = ranking(testVacancies);
// console.log('Результат:', result);

// // Проверка, что результат совпадает с ожидаемым
// if (JSON.stringify(result) === JSON.stringify(expectedOrder)) {
//     console.log('Тест пройден успешно.');
// } else {
//     console.error('Тест не пройден: результат не соответствует ожидаемому порядку.');
// }
