# BookCrossing-Front-End
Platform for book crossing between company employees
[Website](https://bookcrossing.tech/)  
  
## Git Flow  
We are using simpliest github flow to organize our work:  
![Github flow](https://scilifelab.github.io/software-development/img/github-flow.png)  
We have **master** , **develop** and **feature** branches.   
All features must be merged into develop branch!!!
Only the release should merge into the main branch!!!

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites
[Docker](https://www.docker.com) version 17.05 or higher

### Installing
1. Clone it from git hub with $ git clone https://github.com/Lv-492-SoftServe/Bookcrossing-Front-End.git
2. Move to the folder and run "docker build -t web ."
3. Execute "docker run -d -p 80:80 --name web web"
  
**Note! Contribution rules:**  
1. All Pull Requests should start from prefix *#xxx-yyy* where *xxx* - task number and and *yyy* - short description 
e.g. #020-CreateAdminPanel  
2. Pull request should not contain any files that is not required by task.  
In case of any violations, pull request will be rejected.
