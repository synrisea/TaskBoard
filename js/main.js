document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelectorAll('textarea');

    function autoResizeTextarea(area) {
        area.style.height = 'auto'; 
        area.style.height = area.scrollHeight + 'px';
    }

    textarea.forEach(area => {
        area.addEventListener('input', () => {
            autoResizeTextarea(area);
        });

        autoResizeTextarea(area);
    });

    const titleRegex = /^(?!\s)(?!(?:\d+\s?)+$)([A-Za-zА-Яа-я0-9]{1,16}(?:\s[A-Za-zА-Яа-я0-9]{1,16})+)(?<!\s)$/;
    const descriptionRegex = /^(?!\s)(.{1,})$/;

    function validateTitle(title) {
        const trimmedTitle = title.trim();
        const words = trimmedTitle.split(/\s+/);
    
        const isValidFormat = words.length >= 2 && trimmedTitle === trimmedTitle.replace(/\s{2,}/g, ' ');
        const areWordsValid = words.every(word => /^[A-Za-zА-Яа-я0-9]{1,16}$/.test(word));
        const isNotOnlyNumbers = !words.every(word => /^\d+$/.test(word));
    
        return isValidFormat && areWordsValid && isNotOnlyNumbers;
    }

    function validateDescription(description, title) {
        return (
            descriptionRegex.test(description) &&
            description.trim() !== title.trim() &&
            description.split(/\s+/).every(word => word.length <= 16)
        );
    }

    const form = document.querySelector('form');
    const titleInput = document.getElementById('task-title');
    const detailsInput = document.getElementById('task-details');

    form.addEventListener('submit', (event) => {
        const title = titleInput.value.trim();
        const details = detailsInput.value.trim();

        if (!validateTitle(title)) {
            alert("Invalid title! Make sure it has 2-16 characters per word, at least 2 words, and doesn't consist only of numbers.");
            event.preventDefault(); 
            return;
        }

        if (!validateDescription(details, title)) {
            alert("Invalid description! Make sure it doesn't exceed 16 characters per word and isn't the same as the title.");
            event.preventDefault();
            return;
        }

        alert("Task successfully validated!");
    });
});
