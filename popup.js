document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  document.getElementById("add-step").addEventListener("click", () => {
    const stepInput = document.getElementById("new-step");
    const step = stepInput.value.trim();
    if (step) {
      addStep(step);
      stepInput.value = "";
    }
  });

  document.getElementById("add-task").addEventListener("click", async () => {
    const taskInput = document.getElementById("new-task");
    const dueDateInput = document.getElementById("due-date");
    const descriptionInput = document.getElementById("description");
    const includeUrlCheckbox = document.getElementById("include-url");
    const steps = Array.from(document.querySelectorAll("#steps-list li")).map(
      (li) => ({
        text: li.textContent,
        done: li.querySelector("input[type='checkbox']").checked,
      })
    );

    let currentPageUrl = "";
    if (includeUrlCheckbox.checked) {
      currentPageUrl = await getCurrentTabUrl();
    }

    const task = {
      title: taskInput.value.trim(),
      addedDate: new Date().toLocaleString(),
      dueDate: dueDateInput.value,
      description: descriptionInput.value.trim(),
      steps: steps,
      url: currentPageUrl,
    };

    if (task.title) {
      addTask(task);
      saveTask(task);
      setAlarm(task);
      taskInput.value = "";
      dueDateInput.value = "";
      descriptionInput.value = "";
      document.getElementById("steps-list").innerHTML = "";
      includeUrlCheckbox.checked = false;
    }
  });

  function addStep(step) {
    const stepsList = document.getElementById("steps-list");
    const listItem = document.createElement("li");
    const label = document.createElement("label");
    label.classList.add("container");
    label.htmlFor = `step-${stepsList.children.length}-checkbox`;
    label.innerHTML = `<input id="step-${stepsList.children.length}-checkbox" type="checkbox"> <span class="step-title">${step}</span><span class="checkmark"></span>`;
    listItem.appendChild(label);
    stepsList.appendChild(listItem);

    {
      /* <li>          
            <label class="container" for="step-${index}-checkbox"><input id="step-${index}-checkbox" type="checkbox" ${
              step.done ? "checked" : ""
            }> <span class="step-title">${
              step.text
            }</span><span class="checkmark"></span></label>
              
              </li> */
    }
  }

  function addTask(task) {
    const accordion = document.getElementById("accordion");
    accordion.classList.add("hide");
    accordion.classList.remove("hide");
    const section = document.createElement("div");
    section.classList.add("accordion-section");

    const header = document.createElement("div");
    header.classList.add("accordion-header");
    const texth4 = document.createElement("h4");
    texth4.classList.add("task-title");
    header.appendChild(texth4);
    texth4.textContent = task.title;
    header.addEventListener("click", () => {
      content.classList.toggle("active");
      if (document.querySelector(".save-button")) {
        if (content.classList.contains("active")) {
          document.querySelector(".save-button img").src = "images/save.svg";
        } else {
          document.querySelector(".save-button img").src = "images/edit.svg";
        }
      }
    });

    const headerBtnsBox = document.createElement("div");
    headerBtnsBox.classList.add("header-btns-box");

    const content = document.createElement("div");
    content.classList.add("accordion-content");
    content.innerHTML = `
      <p>Added: ${task.addedDate}</p>
      <p class="sm-p">Due: </p><input type="datetime-local" value="${
        task.dueDate
      }" class="edit-due-date">
      <p class="sm-p">Description: </p>
      <textarea class="edit-description">${task.description}</textarea>
      <ul class="edit-steps">${task.steps
        .map(
          (step, index) =>
            `<li>          
            <label class="container" for="step-${index}-checkbox"><input id="step-${index}-checkbox" type="checkbox" ${
              step.done ? "checked" : ""
            }> <span class="step-title">${
              step.text
            }</span><span class="checkmark"></span></label>
              
              </li>`
        )
        .join("")}</ul>
      ${
        task.url
          ? `<p>URL: <a href="${task.url}" target="_blank">${task.url}</a></p>`
          : ""
      }
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
      section.classList.toggle("done", checkbox.checked);
    });

    const deleteButton = document.createElement("button");
    const deleteImg = document.createElement("img");
    deleteButton.classList.add("delete-button");
    deleteImg.src = "images/delete.svg";
    deleteButton.appendChild(deleteImg);
    deleteButton.addEventListener("click", () => {
      document.querySelector(".accordion-container").removeChild(section);
      deleteTask(task);
    });

    const saveButton = document.createElement("button");
    saveButton.classList.add("save-button");
    const saveImg = document.createElement("img");
    saveImg.src = "images/edit.svg";
    saveButton.appendChild(saveImg);
    saveButton.addEventListener("click", () => {
      const newDueDate = section.querySelector(".edit-due-date").value;
      const newDescription = section.querySelector(".edit-description").value;
      const newSteps = Array.from(
        section.querySelectorAll(".edit-steps li")
      ).map((li) => ({
        text: li.textContent.trim(),
        done: li.querySelector("input[type='checkbox']").checked,
      }));

      task.dueDate = newDueDate;
      task.description = newDescription;
      task.steps = newSteps;

      saveTask(task);
      setAlarm(task);
    });

    headerBtnsBox.appendChild(deleteButton);
    headerBtnsBox.appendChild(saveButton);

    const labelForCheckbox = document.createElement("label");
    const SpanForLabel = document.createElement("span");
    labelForCheckbox.classList.add("container");
    SpanForLabel.classList.add("checkmark");
    labelForCheckbox.appendChild(checkbox);
    labelForCheckbox.appendChild(SpanForLabel);

    headerBtnsBox.appendChild(labelForCheckbox);

    section.appendChild(header);
    header.appendChild(headerBtnsBox);
    section.appendChild(content);

    document.querySelector(".accordion-container").appendChild(section);

    checkDueDate(task);
  }

  async function getCurrentTabUrl() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab.url;
  }

  function saveTask(task) {
    chrome.storage.sync.get({ tasks: [] }, (result) => {
      const tasks = result.tasks.filter((t) => t.title !== task.title);
      tasks.push(task);
      chrome.storage.sync.set({ tasks: tasks });
    });
  }

  function loadTasks() {
    chrome.storage.sync.get({ tasks: [] }, (result) => {
      const tasks = result.tasks;
      tasks.forEach((task) => addTask(task));
    });
  }

  function deleteTask(taskToDelete) {
    chrome.storage.sync.get({ tasks: [] }, (result) => {
      const tasks = result.tasks.filter(
        (task) => task.title !== taskToDelete.title
      );
      chrome.storage.sync.set({ tasks: tasks });
    });
  }

  function checkDueDate(task) {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeDiff = dueDate - now;

    if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icon128.png",
        title: "Task Due Soon",
        message: `Your task "${task.title}" is due in less than 30 minutes!`,
      });
    }
  }

  function setAlarm(task) {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeDiff = dueDate - now - 30 * 60 * 1000; // 30 minutes before due date

    if (timeDiff > 0) {
      chrome.alarms.create(`task-${task.title}`, {
        when: Date.now() + timeDiff,
      });
    }
  }
});
