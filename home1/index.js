// Необходимо создать веб-страницу с динамическими элементами с расписанием занятий.

// На странице должна быть таблица с расписанием занятий, на основе JSON-данных.
// Каждая строка таблицы должна содержать информацию о занятии, а именно:
// - название занятия
// - время проведения занятия
// - максимальное количество участников
// - текущее количество участников
// - кнопка "записаться"
// - кнопка "отменить запись"

// Если максимальное количество участников достигнуто, либо пользователь уже записан на занятие, сделайте кнопку "записаться" неактивной.
// Кнопка "отменить запись" активна в случае, если пользователь записан на занятие, иначе она должна быть неактивна.

// Пользователь может записаться на один курс только один раз.

// При нажатии на кнопку "записаться" увеличьте количество записанных участников.
// Если пользователь нажимает "отменить запись", уменьшите количество записанных участников.
// Обновляйте состояние кнопок и количество участников в реальном времени.

// Если количество участников уже максимально, то пользователь не может записаться, даже если он не записывался ранее.

// Сохраняйте данные в LocalStorage, чтобы они сохранялись и отображались при перезагрузке страницы.

// Начальные данные (JSON):

// [
//     {
//         "id": 1,
//         "name": "Йога",
//         "time": "10:00 - 11:00",
//         "maxParticipants": 15,
//         "currentParticipants": 8
//     },
//     {
//         "id": 2,
//         "name": "Пилатес",
//         "time": "11:30 - 12:30",
//         "maxParticipants": 10,
//         "currentParticipants": 9
//     },
//     {
//         "id": 3,
//         "name": "Кроссфит",
//         "time": "13:00 - 14:00",
//         "maxParticipants": 20,
//         "currentParticipants": 15
//     },
//     {
//         "id": 4,
//         "name": "Танцы",
//         "time": "14:30 - 15:30",
//         "maxParticipants": 12,
//         "currentParticipants": 10
//     },
//     {
//         "id": 5,
//         "name": "Бокс",
//         "time": "16:00 - 17:00",
//         "maxParticipants": 8,
//         "currentParticipants": 6
//     }
// ]

const localStorageKey = 'lessons';
const userStorageKey = 'userCourses';
const initialLessons = `[
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 9
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 11
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
] `;

if (!localStorage.getItem(localStorageKey)) {
  localStorage.setItem(localStorageKey, initialLessons);
}
const lessons = JSON.parse(localStorage.getItem(localStorageKey));

if (!localStorage.getItem(userStorageKey)) {
  localStorage.setItem(userStorageKey, JSON.stringify([]));
}

const userCourses = JSON.parse(localStorage.getItem(userStorageKey));
const listLessonEl = document.querySelector('.list-lessons');


// Функция для отображения расписания:
function timetable(item) {
  // для проверки если изначально уже нет мест
  const isLessonFull = item.currentParticipants >= item.maxParticipants;
  // для проверки выбран ли ранее курс
  const isUserSelected = userCourses.includes(item.id);
  const isLastPlace = item.currentParticipants === item.maxParticipants - 1; // Проверка на последнее место

  listLessonEl.insertAdjacentHTML(
    'beforeend',
    `
      <div class="lesson" data-id="${item.id}">
        <div class="nameLesson">Название занятия: ${item.name}</div>
        <div class="timeLesson">Время: ${item.time}</div>
        <div class="maxParticipants">Максимальное количество участников: ${item.maxParticipants}</div>
        <div class="currentParticipants">Текущее количество участников: ${item.currentParticipants}</div>
        <button class="btnRecord" ${isUserSelected || isLessonFull ? 'disabled' : ''}>📝 Записаться</button>
        <button class="btnCancel" ${!isUserSelected || isLastPlace ? 'disabled' : ''}>🗑️ Отменить запись</button>
      </div>
    `,
  );
}
// Обработка событий при клике на кнопку "Записаться"
listLessonEl.addEventListener('click', ({ target }) => {
  const fatherEl = target.closest('.lesson');
  const lessonId = parseInt(fatherEl.getAttribute('data-id'));
  const lesson = lessons.find((item) => item.id === lessonId);

  if (target.matches('.btnRecord')) {
    if (lesson.currentParticipants < lesson.maxParticipants) {
      lesson.currentParticipants += 1;
      fatherEl.querySelector('.currentParticipants').textContent = `Текущее количество участников: ${lesson.currentParticipants}`;
      fatherEl.querySelector('.btnRecord').setAttribute('disabled', true);
      fatherEl.querySelector('.btnCancel').removeAttribute('disabled');
      userCourses.push(lesson.id);
      saveUserCourses(userCourses);
      saveData(lessons);
    } else {
      fatherEl.querySelector('.btnRecord').setAttribute('disabled', true);

    }
  } else if (target.matches('.btnCancel')) {
    if (lesson.currentParticipants > 0) {
      lesson.currentParticipants -= 1;
      fatherEl.querySelector('.currentParticipants').textContent = `Текущее количество участников: ${lesson.currentParticipants}`;
      fatherEl.querySelector('.btnRecord').removeAttribute('disabled');
      fatherEl.querySelector('.btnCancel').setAttribute('disabled', true);
      userCourses = userCourses.filter((courseId) => courseId !== lesson.id);
      saveUserCourses(userCourses);
      saveData(lessons);
    }
  }
});
// Функция для сохранения данных в LocalStorage:
function saveData(array) {
  localStorage.setItem(localStorageKey, JSON.stringify(array));
}
function saveUserCourses(array) {
  localStorage.setItem(userStorageKey, JSON.stringify(array));
}
lessons.forEach(timetable);
