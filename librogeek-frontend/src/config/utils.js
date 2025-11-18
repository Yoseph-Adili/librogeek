const alert = (message) => {
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();


    const alertDiv = document.createElement('div');

    alertDiv.innerHTML = message;

    alertDiv.style.border = '1px solid var(--text-color)'
    alertDiv.style.color = 'var(--text-color)'
    alertDiv.style.background = 'var(--background-color)'
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '50px';
    alertDiv.style.left = '50%';
    alertDiv.style.textAlign = 'center';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.padding = '15px 30px';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    alertDiv.style.zIndex = '9999';

    const app = document.querySelector('.app')
    app.appendChild(alertDiv);


    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
export default alert;