import { exec } from 'child_process';

// Очистка процессов Google Chrome перед запуском скрипта. Если есть активные процессы, то он выдаст ошибку. Необходимый костыль.

const killAllChromeProcesses = () => {
    return new Promise((resolve, reject) => {
        exec('taskkill /F /IM chrome.exe /T', (error, stdout, stderr) => {
            if (stderr && stderr.includes('���� ����� "chrome.exe".')) {
                console.log('Ищем процессы Google Chrome...');
                resolve();
            } else if (error) {
                console.error('Ошибка при завершении процессов Chrome:', error);
                reject(error);
            } else {
                console.log('Ищем процессы Google Chrome...');
                resolve();
            }
        });
    });
};

killAllChromeProcesses()
    .then(() => {
        console.log('Все процессы Chrome завершены.');
    })
    .catch(error => {
        if (error && error.message && error.message.includes('���� ����� "chrome.exe".')) {
            console.log('Процессы Google Chrome отсутствуют.');
        } else {
            console.error('Произошла ошибка при завершении процессов Chrome:', error);
        }
    });

export default killAllChromeProcesses;