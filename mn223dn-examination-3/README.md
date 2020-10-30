## Examination assignment 3
This is the assignment repo for the third assignment in the course. 

## Installation
Make sure node.js and npm is installed on your system.

1. `npm install`
2. `npm start`
3. Browse to [http://localhost:4000](http://localhost:4000)

## Description of the assignment idea
The Personal Web Desktop (PWD)
This examination will focus on building a single page application with chat integration against a web socket server. The backend (server-side code) of this assignment will be given and your job is to write the client-side code.

In this examination assignment you are supposed to build what is called a "Personal Web Desktop" (PWD).

### The assignment has the following objective:
After performing this assignment you will fulfill the three goals described in the course syllabus:
- Analyze problems and then to evaluate and choose appropriate design and construct the solution in the form of programs in the programming language JavaScript.
- Describe a web browsers different internal components and their interactions including browser security mechanisms.
- Create web applications were JavaScript, HTML and CSS have clear roles and are clearly separated.
- Store and with asynchronous communication, transfer data with for the task appropriate data format.
- Create optimized and accessible custom single page applications with offline support and which takes advantage of the browser's native APIs.

#### Functional requirements PWD:
- The application should be a single page application.
- The user shall be able to open multiple windows (not browser windows/tabs but custom windows created using the DOM) within the application.
- The user shall be able to drag and move the windows inside the PWD.
- The user shall be able to open and close new windows of the desired application by clicking or double clicking an icon at the desktop.
- The icon used to open the window should be represented in the upper bar of the window.
- Windows should get focus when clicked/dragged.
- The window with focus shall be on top of all other windows.
- The following three applications should at least be included in the desktop application:
- A memory-game
- A chat connected to a central chat channel using websockets
- One, by you, designed and decided application
#### Non functional requirements PWD:
- A complete git commit history should be present for assessment. For this assignment somewhere between 30 and 200 commits is normal
- The code standard standard.js should be followed. (npm start will show errors if you are not complying)
- All Exported functions, classes and types should be commented. Perferably using JSDoc.
- The application shall be visually appealing
- The code shall be organized in appropriate modules, at least four (4).
