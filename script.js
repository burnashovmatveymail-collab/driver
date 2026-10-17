const CLIENT_ID = '676738979449-2v9u709hdl8ab0soj54tquo2cprg630a.apps.googleusercontent.com';
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
            }
        },
    });
}

window.onload = () => {
    setTimeout(initGoogleAuth, 500);
};

document.getElementById('google-login').onclick = () => {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        alert("Google API ещё не загрузился. Попробуйте снова через пару секунд.");
    }
};

document.getElementById('logout-btn').onclick = () => {
    accessToken = null;
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
};
