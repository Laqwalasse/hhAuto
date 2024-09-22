import exceljs from 'exceljs';
import fs from 'fs';
import path from 'path';
import settings from './settings.mjs';

// Создание Excel файла с данными о пропущенных/откликнутых вакансиях.

export async function createExcelFile(skippedVacancies, appliedVacancies) {
    const workbook = new exceljs.Workbook();
    const worksheetSkipped = workbook.addWorksheet('Пропустили');
    const worksheetApplied = workbook.addWorksheet('Откликнулись');

    worksheetSkipped.columns = [
        { header: 'Номер', key: 'number', width: 10 },
        { header: 'Название вакансии', key: 'title', width: 50 },
        { header: 'Ссылка на вакансию', key: 'link', width: 100 }
    ];

    worksheetApplied.columns = [
        { header: 'Номер', key: 'number', width: 10 },
        { header: 'Название вакансии', key: 'title', width: 50 },
        { header: 'Ссылка на вакансию', key: 'link', width: 100 }
    ];

    skippedVacancies.forEach((vacancy, index) => {
        worksheetSkipped.addRow({ number: index + 1, title: vacancy.title, link: { text: 'Ссылка', hyperlink: vacancy.link } });
    });

    appliedVacancies.forEach((vacancy, index) => {
        worksheetApplied.addRow({ number: index + 1, title: vacancy.title, link: { text: 'Ссылка', hyperlink: vacancy.link } });
    });

    const outputPath = settings.outputPath; // Путь к созданному файлу.
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const fileName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;
    const filePath = path.join(outputPath, fileName);

    await workbook.xlsx.writeFile(filePath);
    console.log('Excel файл сохранён.');
}