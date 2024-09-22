// Перед блоком экселя.

// Начало функции.

(async () => {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Этот дилей на 5 секунд относится к блоку завершения процессов хрома, но я не могу его туда включить, потому что промисы можно только в асинк вставлять.
    const browser = await puppeteer.launch({
        headless: settings.headless
    });
    console.log('Открываем браузер...');
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    try {
        console.log('Переход на страницу авторизации...');
        await page.goto('https://hh.ru/account/login');

        const usernameSelector = 'input[data-qa="login-input-username"]';
        const expandButtonSelector = 'button[data-qa="expand-login-by-password"]';
        const passwordSelector = 'input[data-qa="login-input-password"]';
        const submitButtonSelector = 'button[data-qa="account-login-submit"]';

        console.log('Авторизация...');
        await page.click(expandButtonSelector);
        await page.waitForSelector(usernameSelector);
        await page.type(usernameSelector, settings.login);
        await page.type(passwordSelector, settings.password);
        await page.click(submitButtonSelector);
        await page.waitForNavigation();

        console.log('Переходим на hh.ru...');
        await page.goto('https://hh.ru/');