// Вставь сюда свой Client ID из Google Cloud Console
const CLIENT_ID = 'ТВОЙ_CLIENT_ID.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let accessToken = null;

function initGoogleAuth() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.access_token) {
                accessToken = response.access_token;
                document.getElementById('auth-screen').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                console.log("Успешный вход!");
            }
        },
    });
}

window.onload = () => {
    // Ждём загрузки библиотеки Google
    setTimeout(initGoogleAuth, 500);
};

document.getElementById('google-login').onclick = () => {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        alert("Ошибка загрузки Google API");
    }
};

document.getElementById('logout-btn').onclick = () => {
    accessToken = null;
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
};
