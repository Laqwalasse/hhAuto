import exceljs from 'exceljs';
import fs from 'fs';
import path from 'path';
import data from './data.mjs';

// Создание Excel файла с данными о вакансиях.
export async function createExcelFile(skippedVacancies, appliedVacancies, extractedVacancies) {
    const workbook = new exceljs.Workbook();
    const worksheetExtracted = workbook.addWorksheet('Извлекли');
    const worksheetSkipped = workbook.addWorksheet('Пропустили');
    const worksheetApplied = workbook.addWorksheet('Откликнулись');

    worksheetExtracted.columns = [
        { header: 'Номер', key: 'number', width: 10 },
        { header: 'Название вакансии', key: 'title', width: 50 },
        { header: 'Опыт работы', key: 'experience', width: 20 },
        { header: 'Ссылка на вакансию', key: 'link', width: 100 }
    ];

    worksheetSkipped.columns = [
        { header: 'Номер', key: 'number', width: 10 },
        { header: 'Название вакансии', key: 'title', width: 50 },
        { header: 'Опыт работы', key: 'experience', width: 20 },
        { header: 'Ссылка на вакансию', key: 'link', width: 100 }
    ];

    worksheetApplied.columns = [
        { header: 'Номер', key: 'number', width: 10 },
        { header: 'Название вакансии', key: 'title', width: 50 },
        { header: 'Опыт работы', key: 'experience', width: 20 },
        { header: 'Ссылка на вакансию', key: 'link', width: 100 }
    ];

    extractedVacancies.forEach((vacancy, index) => {
        worksheetExtracted.addRow({
            number: index + 1,
            title: vacancy.title,
            experience: vacancy.experience,
            link: { text: 'Ссылка', hyperlink: vacancy.link }
        });
    });

    skippedVacancies.forEach((vacancy, index) => {
        worksheetSkipped.addRow({
            number: index + 1,
            title: vacancy.title,
            experience: vacancy.experience,
            link: { text: 'Ссылка', hyperlink: vacancy.link }
        });
    });

    appliedVacancies.forEach((vacancy, index) => {
        worksheetApplied.addRow({
            number: index + 1,
            title: vacancy.title,
            experience: vacancy.experience,
            link: { text: 'Ссылка', hyperlink: vacancy.link }
        });
    });

    const outputPath = data.outputPath; // Путь к созданному файлу.
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const now = new Date();
    const fileName = `${now.toISOString().slice(0, 10)}_${now.toTimeString().slice(0, 8).replace(/:/g, '-')}.xlsx`; // Форматирование имени файла.
    const filePath = path.join(outputPath, fileName);

    await workbook.xlsx.writeFile(filePath);
    console.log('Excel файл сохранён.');
}
