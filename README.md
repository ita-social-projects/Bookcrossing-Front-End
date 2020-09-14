# BookCrossing-Front-End [![Build Status](https://travis-ci.org/ita-social-projects/Bookcrossing-Front-End.svg?branch=develop)](https://travis-ci.org/ita-social-projects/Bookcrossing-Front-End) [![Build number](https://img.shields.io/badge/build-number-blue.svg)](https://travis-ci.org/github/ita-social-projects/Bookcrossing-Front-End/builds) 
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
1. Clone repository from GitHub with $ git clone https://github.com/Lv-492-SoftServe/Bookcrossing-Front-End.git
2. Move to the Bookcrossing-Front-End and run "docker build -t frontend ."
3. Next run "docker run -d -p 80:80 --name web frontend"
4. Go to the [localhost](http://localhost/) in your browser
  
**Note! Contribution rules:**  
1. All Pull Requests should start from prefix *#xxx-yyy* where *xxx* - task number and and *yyy* - short description 
e.g. #020-CreateAdminPanel  
2. Pull request should not contain any files that is not required by task.  
In case of any violations, pull request will be rejected.
