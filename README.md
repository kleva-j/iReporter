[![Build Status](https://travis-ci.org/kleva-j/iReporter.svg?branch=develop)](https://travis-ci.org/kleva-j/iReporter) [![Coverage Status](https://coveralls.io/repos/github/kleva-j/iReporter/badge.svg?branch=Feature%2F%23162275644%2Fintegrate-test-coverage-reporting)](https://coveralls.io/github/kleva-j/iReporter?branch=Feature%2F%23162275644%2Fintegrate-test-coverage-reporting) [![Maintainability](https://api.codeclimate.com/v1/badges/9c8e7520be6e16b76a71/maintainability)](https://codeclimate.com/github/kleva-j/iReporter/maintainability)[![Test Coverage](https://api.codeclimate.com/v1/badges/9c8e7520be6e16b76a71/test_coverage)](https://codeclimate.com/github/kleva-j/iReporter/test_coverage)

# iReporter

___
iReporter enables any/every citizen to bring any form of corruption to the notice of appropriate authorities and the general public.

## Features

___

- Users can signup and login to the application.
- Users can create a record of a red-flag or intervention.
- Users can view all record of their red-flag.
- Users can view the details of their red-flag record.
- Users can add image or video evidence to a red-flag or intervention record to support the claim.
- Users can edit a record of a red-flag or intervention.
- Users can delete a record of a red-flag or intervention.
- Users can add geographical information (Latitude and Longitude Coordinates) to their red-flag or intervention record.
- Users can change the georaphical information attached to a red-flag or intervention record.
- User can receive sms message whenever the status of their red-flag or intervention record is changed.
- Users can receive email notification update whenever the status of their red-flag or intervention record is changed.
- An Administrative user can edit the status of a red-flag or intervention record.

## TECHNOLOGIES

---

### Front-End

The frontend is implemented using:

- [HTML](https://www.w3schools.com/Html/) A standard markup language for creating web pages.
- [css](https://www.w3schools.com/css/css_intro.asp) A style sheet language used for describing the presentation of a document written in a markup language like HTML.
- [Javascript](https://www.w3schools.com/js/default.asp).
- [Axios](https://github.com/axios/axios) A Promised based HTTP client for the browser and nodejs.

### Back-End

The backend is implemented using:

- [Nodejs](https://www.nodejs.com/en/) - A javascript runtime built on Chrome's V8 javascript engine.
- [Express](https://www.expressjs.com/) - A web framework for [Nodejs](https://www.nodejs.com/).
- [Eslint](https://www.eslint.org/) - A Javascript linter.
- [Babel](https://babeljs.io/) - A Javascript compiler.

## INSTALLATION

- install [Node js](https://nodejs.org/en/)
- Clone the repository `git clone https://github.com/kleva-j/iReporter.git` 
- Navigate to the location in your terminal
- Run `npm install` to install dependencies
- Run `npm start` to get the app started on your local machine.

### Testing

- [Mocha](https://mochajs.org/) - A Javascript test framework.
- [Chai](http://chaijs.com) - A BDD / TDD Assertion library.
- [nyc](https://github.com/istanbuljs/nyc) - The Istanbul command line interface.

The UI templates for this App can be viewed on [GitHub Pages](https://pages.github.com/) using the URL below :

- [IREPORTER:](https://kleva-j.github.io/iReporter/)

### Endpoints

- GET `api/v1/red-flags` :- This route is used to gets all red-flags records

- GET `api/v1/red-flags/:id` :- This route is used to get a specific red-flag record

- POST `api/v1/red-flags` :- This route is used to create a red-flag record

- PATCH `api/v1/red-flags/:id/location` :- This route is used edit the location of a specific red-flag record

- PATCH `api/v1/red-flags/:id/comment` :- This route is used edit the comment of a specific red-flag record

- DELETE `api/v1/red-flags/:id` :- This route is used to delete a specific red-flag record

Link to api endpoints on [HEROKU](https://www.guarded-hamlet-61027.herokuapp.com)

## Contributing

- Fork this repository
- Clone to your local machine: https://github.com/kleva-j/iReporter.git
- Create your feature branch using the name format: Feature/325428973/my-new-feature
- Commit your changes: git commit -am 'Add some feature'
- Write test for the new features
- Push to the branch: git push origin ft-my-new-feature-2178134
- Submit a pull request against the development branch

### Author

- [Michael Obasi](maito:kasmickleva@gmail.com)

### Licence

- [MIT License](https://github.com/kleva-j/iReporter/blob/develop/LICENSE)