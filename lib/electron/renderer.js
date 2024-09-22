document.addEventListener('DOMContentLoaded', () => {
    const settingsContainer = document.getElementById('settings-container');
    const runButton = document.getElementById('run-button');
    const raiseButton = document.getElementById('raise-button');
    const updateButton = document.getElementById('update-button');

    // Function to render settings
    function renderSettings(settings) {
        settingsContainer.innerHTML = ''; // Очистить контейнер перед добавлением новых элементов
        settings.forEach(([key, value]) => {
            if (key) { // Убедитесь, что ключ не пустой
                // Проверка на существование элемента с таким id, чтобы избежать дублирования
                if (!document.getElementById(key)) {
                    const container = document.createElement('div');
                    container.classList.add('container');
                    
                    // Label for parameter and current value
                    const label = document.createElement('div');
                    label.classList.add('parameter-label');
                    label.innerHTML = `${key} : <span class="current-value">${value === undefined || value === null || value === '' ? 'none' : value}</span>`;
                    
                    // Input field
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = key;
                    input.value = ''; // Поле ввода будет пустым изначально

                    // Buttons container
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.classList.add('buttons-container');

                    // Save button for this parameter
                    const saveButton = document.createElement('button');
                    saveButton.textContent = 'Сохранить';
                    saveButton.classList.add('save-button');
                    saveButton.addEventListener('click', () => {
                        const newValue = input.value.trim();
                        const currentValue = container.querySelector('.current-value');
                        const savedValue = newValue || 'none';
                        currentValue.textContent = savedValue;
                        electronAPI.updateSetting(key, newValue).then(() => {
                            input.value = ''; // Очищаем поле ввода после сохранения
                        });
                    });

                    // Clear button for this parameter
                    const clearButton = document.createElement('button');
                    clearButton.textContent = 'Очистить';
                    clearButton.classList.add('clear-button');
                    clearButton.addEventListener('click', () => {
                        input.value = ''; // Просто очищаем поле ввода
                    });

                    // Reset button for this parameter
                    const resetButton = document.createElement('button');
                    resetButton.textContent = 'Сбросить';
                    resetButton.classList.add('reset-button');
                    resetButton.addEventListener('click', () => {
                        const currentValue = container.querySelector('.current-value');
                        input.value = ''; // Очищаем поле ввода
                        currentValue.textContent = 'none'; // Устанавливаем значение в 'none'
                        electronAPI.clearSetting(key);
                    });

                    buttonsContainer.appendChild(saveButton);
                    buttonsContainer.appendChild(clearButton);
                    buttonsContainer.appendChild(resetButton);

                    container.appendChild(label);
                    container.appendChild(input);
                    container.appendChild(buttonsContainer);
                    settingsContainer.appendChild(container);
                }
            }
        });
    }

    // Load settings from file
    electronAPI.readSettings().then(data => {
        const settings = data.split('\n').filter(line => line.trim()).map(line => line.split('='));
        renderSettings(settings);
    });

    // Run scripts
    runButton.addEventListener('click', () => {
        electronAPI.runScript('app.mjs');
    });

    raiseButton.addEventListener('click', () => {
        electronAPI.runScript('raise.js');
    });

    updateButton.addEventListener('click', () => {
        electronAPI.runScript('update.js');
    });
});
