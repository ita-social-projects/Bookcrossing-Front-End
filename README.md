# BookCrossing-Front-End  [![License: MIT](https://img.shields.io/badge/license-MIT-ff69b4)](https://github.com/ita-social-projects/Bookcrossing-Front-End/blob/develop/LICENSE)  [![Build Status](https://travis-ci.org/ita-social-projects/Bookcrossing-Front-End.svg?branch=develop)](https://travis-ci.org/ita-social-projects/Bookcrossing-Front-End) [![Build number](https://img.shields.io/badge/build-number-blue.svg)](https://travis-ci.org/github/ita-social-projects/Bookcrossing-Front-End/builds) 
Platform for book crossing between company employees
[Website](https://bookcrossing.tech/) 
  
## Git Flow  
We are using simpliest github flow to organize our work:  
![Github flow](https://scilifelab.github.io/software-development/img/github-flow.png)  
We have **master** , **develop** and **feature** branches.   
All features must be merged into develop branch!!!
Only the release should merge into the main branch!!!

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes using docker containers.

### Prerequisites
[Docker](https://www.docker.com) version 17.05 or higher

###### Note: It's better to use [docker-desktop](https://www.docker.com/products/docker-desktop) if you are on windows

### Installing
1. Clone repository from GitHub with $ git clone https://github.com/ita-social-projects/Bookcrossing-Front-End.git
2. Move to the Bookcrossing-Front-End and run "docker build -t frontend ."
3. Next run "docker run -d -p 80:80 --name web frontend"
4. Go to the [localhost](http://localhost/) in your browser
  
## Contribution rules: 
You're encouraged to contribute to our project if you've found any issues or missing functionality that you would want to see. Here you can see [the list of issues](https://github.com/ita-social-projects/Bookcrossing-Back-End/issues) and here you can create [a new issue](https://github.com/ita-social-projects/Bookcrossing-Back-End/issues/new/choose).

Before sending any pull request, please discuss requirements/changes to be implemented using an existing issue or by creating a new one. All pull requests should be done into `dev` branch.

Though there are two GitHub projects: [Bookcrossing-Back-End](https://github.com/ita-social-projects/Bookcrossing-Back-End) for back-end part and [BookCrossing-Front-End](https://github.com/ita-social-projects/Bookcrossing-Front-End) for front-end part) all of the requirements are listed in the first one - [Bookcrossing-Back-End](https://github.com/ita-social-projects/Bookcrossing-Back-End). 

Every pull request should be linked to an issue. So if you make changes on front-end part you should create an issue there (subtask) with a link to corresponding requirement (story, task or epic) on back-end.

All Pull Requests should start from prefix *#xxx-yyy* where *xxx* - task number and and *yyy* - short description 
e.g. #020-CreateAdminPanel  
Pull request should not contain any files that is not required by task.  
