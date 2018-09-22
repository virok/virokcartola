# VirokCartola

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

#Firebase
Project Console: https://console.firebase.google.com/project/cartolabyvirok/overview
Hosting URL: https://cartolabyvirok.firebaseapp.com
First, Deploy your angular project with ng build, and then firebase deploy
Deploy: firebase deploy
Local Deploy: firebase serve
<!-- ##Check/See the app runing in Electron
npm run electron-build

##Build Angular Desktop Apps With Electron
https://angularfirebase.com/lessons/desktop-apps-with-electron-and-angular/#Packaging-for-Desktop-Operating-Systems

Type this Command in a terminal: electron-packager . --platform=win32 -->

##Requirements
- Option to create Tournaments and its games automaticaly
- Points will be assigned to each team per round in the main Cartola Component
- Based on these points, the results of the selected Tournaments will be made, such as win, draw, lose, points at that tornament etc.
- Components/Pages: Main Cartola Season, Teams, Tournaments(every team will participate on every Tournaments)
- Storage/DB: FIleSystem / Json file using ngx-fs https://stackoverflow.com/questions/49906807/how-to-connect-to-local-database-in-electron

- Tournaments identified so far: Campeonato Brasileiro (20 teams),Copa do Brasil, Libertadores

# virokcartola
