const user = sessionStorage.getItem('user');

if (!user) {
    window.location.href = '/login';
} else {
    document.getElementById('user-email').textContent = user;
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    });
}
