# My To-Do List Extension

My To-Do List Extension is a simple and efficient Chrome extension that helps you manage your tasks and to-do lists. You can add tasks, set due dates, add descriptions, include steps, and even attach the current page URL to your tasks. The extension also notifies you when a task is due in less than an hour.

## Features

- Add tasks with titles, due dates, descriptions, and steps.
- Include the current page URL in your tasks.
- Mark steps as done or not done.
- Edit tasks and steps.
- Delete tasks.
- Receive notifications when a task is due in less than an hour.

## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on the "Load unpacked" button and select the directory where you downloaded the extension.

## Usage

1. Click on the extension icon in the Chrome toolbar to open the to-do list popup.
2. Enter the task title, due date, description, and steps.
3. Check the "Include current page URL" checkbox if you want to attach the current page URL to the task.
4. Click the "Add Task" button to add the task to your list.
5. Click on a task header to expand or collapse the task details.
6. Use the checkboxes next to each step to mark them as done or not done.
7. Click the "Save" button to save any changes to the task.
8. Click the "Delete" button to remove a task from the list.

## Notifications

The extension will notify you when a task is due in less than an hour. Make sure to allow notifications for the extension in your Chrome settings.

## Permissions

The extension requires the following permissions:

- `storage`: To save and retrieve tasks.
- `activeTab`: To get the current page URL.
- `scripting`: To interact with the current page.
- `notifications`: To show notifications.
- `alarms`: To set alarms for task notifications.

## Contributing

If you would like to contribute to the development of this extension, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
