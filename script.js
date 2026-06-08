// --- Таймер ---
const timerContainer = document.getElementById('timer');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');

let timerInterval;

function updateTimer() {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    const diff = nextYear - now;

    if (diff <= 0) {
        // Текст разбит на две строки, чтобы лучше поместиться в звезде
        timerContainer.innerHTML = "<div class='happy-new-year'>С Новым<br>Годом!</div>";
        if (timerInterval) clearInterval(timerInterval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    // Добавляем ведущие нули
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
}

// Обновляем таймер каждую минуту, так как секунды больше не отображаются
timerInterval = setInterval(updateTimer, 60000);
updateTimer(); // Вызов сразу, чтобы не ждать 1 минуту

// --- Звук при клике на животных ---
const animals = document.querySelectorAll('.animal');
const audioCache = {}; // Кэш для хранения загруженных аудио-объектов

animals.forEach(animal => {
    animal.addEventListener('click', () => {
        const soundPath = animal.getAttribute('data-sound');
        
        if (soundPath) {
            // Если звук еще не загружался, создаем новый объект Audio
            if (!audioCache[soundPath]) {
                audioCache[soundPath] = new Audio(soundPath);
            }
            
            // Сбрасываем звук на начало, если кликают быстро по одному и тому же животному
            audioCache[soundPath].currentTime = 0; 
            audioCache[soundPath].play().catch(e => console.log("Браузер заблокировал автовоспроизведение", e));
        }
    });
});

// --- Открытие подарков и показ видео ---
const gifts = document.querySelectorAll('.gift');
const modal = document.getElementById('video-modal');
const modalContent = document.querySelector('.modal-content');
const videoFrame = document.getElementById('video-frame');
const closeModal = document.getElementById('close-modal');

gifts.forEach(gift => {
    gift.addEventListener('click', () => {
        const isOpening = !gift.classList.contains('open');
        
        // Переключаем класс для анимации открытия/закрытия коробки
        gift.classList.toggle('open');
        
        // Если коробка открывается, показываем видео
        if (isOpening) {
            const videoId = gift.getAttribute('data-video-id');
            
            if (videoId) {
                // Ждем 600мс, чтобы успела проиграться анимация открытия коробки
                setTimeout(() => {
                    // Вычисляем координаты центра коробки относительно экрана
                    const rect = gift.getBoundingClientRect();
                    const giftCenterX = rect.left + rect.width / 2;
                    const giftCenterY = rect.top + rect.height / 2;
                    
                    // Вычисляем центр экрана
                    const windowCenterX = window.innerWidth / 2;
                    const windowCenterY = window.innerHeight / 2;
                    
                    // Смещение от центра экрана до коробки
                    const tx = giftCenterX - windowCenterX;
                    const ty = giftCenterY - windowCenterY;
                    
                    // Передаем координаты в CSS переменные для анимации
                    modalContent.style.setProperty('--start-x', `${tx}px`);
                    modalContent.style.setProperty('--start-y', `${ty}px`);

                    // Показываем модальное окно (начинается анимация вылета)
                    modal.classList.remove('hidden');

                    // Загружаем iframe с небольшой задержкой (300мс), 
                    // чтобы тяжелый плеер YouTube не вызывал зависаний во время полета окна
                    setTimeout(() => {
                        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    }, 300);
                    
                }, 600);
            }
        }
    });
});

// Функция закрытия модального окна
function hideModal() {
    modal.classList.add('hidden');
    
    // Ждем завершения анимации скрытия (около 800мс) перед очисткой видео,
    // чтобы окно успело красиво "улететь" обратно в коробку
    setTimeout(() => {
        videoFrame.src = ''; 
    }, 800);
}

// Закрытие по крестику
closeModal.addEventListener('click', hideModal);

// Закрытие по клику на темный фон вокруг видео
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});
