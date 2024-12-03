document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelectorAll('textarea');

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto'; 
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    textarea.forEach(area => {
        area.addEventListener('input', () => {
            autoResizeTextarea(area);
        });

        autoResizeTextarea(area);
    });
});
