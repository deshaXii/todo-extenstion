chrome.runtime.onInstalled.addListener(() => {
  console.log("To-Do List Extension installed");
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith("task-")) {
    const taskTitle = alarm.name.substring(5);
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/icon128.png",
      title: "Task Due Soon",
      message: `Your task "${taskTitle}" is due in less than 30 minutes!`,
    });
  }
});
