# ФУНКЦИОНАЛЬНЫЕ БЛОКИ

`advanced_search.mjs` - расширенный поиск и его фильтры на hh.

`excel.mjs` - создание эксель файла с перечнем пропущенных и откликнутых вакансий.

`extraction.mjs` - алгоритм извлечения вакансий из поиска для дальнейших ранжирования, фильтрации и отклика.

`kill_chrome.mjs` - убийство процессов Google Chrome для корректного запуска скрипта.

`ranking.mjs` - ранжирование извлеченных вакансий для отклика, на текущий момент по требуемому опыту работы.

`remote.mjs` - блок дополнительной более глубокой фильтрации вакансий по наличию удалённого формата работы в них.

`respond.mjs` - выбор резюме и отклик им на вакансии.

`settings.mjs` - извлечение значений из текстового файла.

`local.mjs` - запуск программы через локальный профиль Google Chrome без авторизации.

`virtual.mjs` - запуск программы в виртуальной машине node с обязательной авторизацией.

`renderer.js` - отрисовка electron GUI.

`preload.js` - взаимодействие electron GUI с основным функционалом.

`index.html` - визуальное описание electron GUI.