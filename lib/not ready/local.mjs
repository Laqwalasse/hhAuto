// Перед блоком экселя.

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

// Начало функции.

(async () => {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Этот дилей на 5 секунд относится к блоку завершения процессов хрома, но я не могу его туда включить, потому что промисы можно только в асинк вставлять.
    const browser = await puppeteer.launch({
        headless: settings.headless,
        userDataDir: settings.userDataDir, // Профиль пользователя Google Chrome.
        executablePath: settings.executablePath // Путь к файлу запуска Google Chrome.
    });

    console.log('Открываем браузер...');
    try {
        const page = await browser.newPage();
        page.setDefaultTimeout(60000);
        page.setDefaultNavigationTimeout(60000);
        console.log('Переходим на hh.ru...');
        await page.goto('https://hh.ru/');