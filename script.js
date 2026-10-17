const CLIENT_ID = '676738979449-2v9u709hdl8ab0soj54tquo2cprg630a.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let accessToken = localStorage.getItem('access_token') || null;
let currentLang = localStorage.getItem('app_lang') || 'ru';

const translations = {
    ru: {
        authSubtitle: "Синхронизация тетрадей с вашим Google Диском",
        loginBtn: "Войти через Google",
        createNotebook: "Создать тетрадь",
        createGroup: "Создать группу",
        exportPdf: "Экспорт в PDF",
        groupsTitle: "Группы",
        allNotebooks: "Все тетради",
        logout: "Выйти"
    },
    en: {
        authSubtitle: "Sync notebooks directly with your Google Drive",
        loginBtn: "Sign in with Google",
        createNotebook: "Create Notebook",
        createGroup: "Create Group",
        exportPdf: "Export to PDF",
        groupsTitle: "Groups",
        allNotebooks: "All Notebooks",
        logout: "Sign Out"
    }
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function initGoogleAuth() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.access_token) {
                accessToken = response.access_token;
                localStorage.setItem('access_token', accessToken);
                showDashboard();
            }
        },
    });

    // Авто-вход, если сессия сохранена
    if (accessToken) {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'grid';
}

window.onload = () => {
    setLanguage(currentLang);
    setTimeout(initGoogleAuth, 500);

    // Переключение языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = (e) => setLanguage(e.target.getAttribute('data-lang'));
    });
};

document.getElementById('google-login').onclick = () => {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    }
};

document.getElementById('logout-btn').onclick = () => {
    accessToken = null;
    localStorage.removeItem('access_token');
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
};

// Заглушки для кнопок управления
document.getElementById('create-notebook-btn').onclick = () => {
    alert(currentLang === 'ru' ? 'Функция создания тетради в разработке' : 'Notebook creation coming soon');
};

document.getElementById('create-group-btn').onclick = () => {
    alert(currentLang === 'ru' ? 'Функция создания групп в разработке' : 'Group creation coming soon');
};

document.getElementById('export-pdf-btn').onclick = () => {
    window.print();
};
