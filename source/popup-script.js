let extension_switch = document.querySelector('#switch');

function toggle_switch() {
  extension_switch.classList.toggle('enabled');
  document.body.classList.toggle('enabled');
  let enabled = document.body.classList.contains("enabled");
  chrome.storage.sync.set({'asurso-custom-names-enabled': enabled}, () => {});
  document.querySelector('#heading').innerText = enabled ? "Включено" : "Выключено";
}

extension_switch.addEventListener('click', toggle_switch);

chrome.storage.sync.get('asurso-custom-names-enabled', function (data) {
  let enabled = data['asurso-custom-names-enabled'];
  if(data === undefined){
    chrome.storage.sync.set({'asurso-custom-names-enabled': true}, () => {});
    enabled = true
  }
  extension_switch.classList.remove('enabled');
  if(enabled)
    toggle_switch();
});

document.querySelector("#add").addEventListener("click", () => {
  let real_name = document.querySelector("#subject-name")
  let custom_name = document.querySelector("#subject-custom-name")
  chrome.storage.sync.get('asurso-custom-names-subjects', function (data) {
    let subjects_custom_names = data['asurso-custom-names-subjects']
    let name_list = new CustomNames(subjects_custom_names)
    name_list.add(real_name.value, custom_name.value)
    chrome.storage.sync.set({'asurso-custom-names-subjects': name_list.get()}, () => {
      fetchList();
    });
    real_name.value = ""
    custom_name.value = ""
  });
});

document.querySelectorAll(".remove").forEach(button => {
  button.addEventListener("click", () => {
    removeThis(button)
  });
});

function removeThis(button) {
  let real_name = button.parentElement.querySelector(".subject-name")
  chrome.storage.sync.get('asurso-custom-names-subjects', function (data) {
    let subjects_custom_names = data['asurso-custom-names-subjects']
    let name_list = new CustomNames(subjects_custom_names)
    name_list.remove(real_name.value)
    chrome.storage.sync.set({'asurso-custom-names-subjects': name_list.get()}, () => {
      fetchList();
    });
  });
}

function fetchList(){
  document.querySelector('#names-list').innerHTML = ""
  chrome.storage.sync.get('asurso-custom-names-subjects', function (data) {
    let subjects_custom_names = data['asurso-custom-names-subjects'] ?? []
    let data_keys = Object.keys(subjects_custom_names)
    data_keys.forEach((item, i) => {
      let itemel = document.createElement("div");
      itemel.id = "list-element";

      let button = document.createElement("input");
      button.type = "button"
      button.class = "remove"
      button.value = "Удалить"
      button.addEventListener("click", () => {
        removeThis(button)
      })

      let input1 = document.createElement("input")
      input1.placeholder = "Название предмета"
      input1.className = "subject-name"
      input1.value = item
      input1.setAttribute("disabled", "disabled");

      let label = document.createElement("label");
      label.innerText = "->"

      let input2 = document.createElement("input")
      input2.placeholder = "Кастомное название"
      input2.value = subjects_custom_names[item]
      input2.setAttribute("disabled", "disabled");

      itemel.appendChild(button)
      itemel.appendChild(input1)
      itemel.appendChild(label)
      itemel.appendChild(input2)
      document.querySelector('#names-list').appendChild(itemel)
    });
  });
}
fetchList();

class CustomNames {
  constructor(list){
    this.subjects_custom_names = list
    console.log(list)
  }

	add(subject, custom_name){
		if(this.subjects_custom_names[subject] !== undefined) { return false; }
		this.subjects_custom_names[subject] = custom_name
		return true;
	}

	remove(subject){
		if(this.subjects_custom_names[subject] === undefined) { return false; }
		delete this.subjects_custom_names[subject]
		return true;
	}

  get(){
    return this.subjects_custom_names
  }
}