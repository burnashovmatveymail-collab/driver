// Переход после входа
document.getElementById('google-login').onclick = () => {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
};

// Переход в редактор тетради
document.getElementById('create-btn').onclick = () => {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('editor').style.display = 'block';
};
