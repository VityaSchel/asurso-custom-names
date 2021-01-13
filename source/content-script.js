chrome.storage.sync.get('asurso-custom-names-enabled', function (data) {
  if(data !== false){
    let subjects_custom_names;
    chrome.storage.sync.get('asurso-custom-names-subjects', function (data) {
      subjects_custom_names = data['asurso-custom-names-subjects']
      if(subjects_custom_names === undefined){
        subjects_custom_names = {
        	"Математика (Алгебра)": "Мозгоебра",
        	"Математика (Геометрия)": "Хуеметрия",
        	"Русский язык": "Родной язык",
        	"Физика": "Формулоебство",
        	"Английский язык": "Гейропейский язык",
        	"Информатика..": "Компьютерный клуб",
        	"Основы проектной деятельности": "Основы пизды девственницы",
        	"Основы технологии программирования": "Хакерство",
        	"Основы безопасности жизнедеятельности": "Терроризм и пожары",
        	"Химия": "Breking Bad",
        	"География": "Порнография",
        	"Биология": "Зоофилия",
        	"История": "Пиздория",
        	"Литература": "Хуепиздура",
        	"Физическая культура": "Армейская кафедра"
        }
        chrome.storage.sync.set({'asurso-custom-names-subjects': subjects_custom_names}, () => {});
      }
      let _scn_interval = setInterval(() => {
      	let subjects = document.querySelectorAll("a[ng-if='lesson.subjectName']")
      	if(subjects.length)
      		clearInterval(_scn_interval)
      	subjects.forEach(subject => {
      		let subject_name = subject.getAttribute('title')
      		let custom_name = subjects_custom_names[subject_name]
      		custom_name = custom_name ?? subject_name
      		subject.innerText = custom_name
      	})
      }, 100)
    });
  }
});



