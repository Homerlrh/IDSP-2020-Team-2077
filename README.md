# BCIT IDSP project : Redesign Craigslist


Apr 2020 – May 2020

Project description- Allow users to post free ADs and or see all other posts from another user
- Redesign Craigslist with modern design language with more responsive web design.
- Develop backend server with NodeJS, use MySQL database to store data
- Front end development with EJS templating language, CSS3, Bootstrap 4, HTML5, JavaScript, jQuery
- Implement a search engine with MySQL and ExpressJS
- Use socket io and MySQL build a live chat system
- Added in-app filter to allow users to locate their wanted item effectively
- Hosted on Heroku, allow a user to access this web app anywhere and any devices
- Collaborating with 4 other colleagues from another department, applying Agile development methodologies, Git workflow and GitHub action.

## [view project](https://idsp-craigslist-redesign.herokuapp.com/content/home)

---

### used technology:

- #### Front End 
  - EJS
  - HTML 5
  - CSS3 / SASS
  - Bootstrap 4
  - jQuery
  - Vanilla JS

- #### Back End
  - nodeJS
  - ExpressJS
  - passportJS + JSON WEB TOKEN
  - Socket io

- #### database
  - Google mySQL instance

- #### Image hosting
  - Amazon S3 bucket

---

## How to use ?

#### requirement
```Note: if you want to enable the oauth function, you need to get you api from facebook and google```
- A google mySQL instance [click here to get one](https://cloud.google.com/sql/docs/mysql/create-instance)
  
- A s3 bucket for hosting image [click here to get one](https://aws.amazon.com/s3/)
  
- A cloudfront CDN to route you s3 bucket <a href="#cloudFront">How to set up</a>

- [Set up AWS IAM](https://console.aws.amazon.com/iam/home?) policy and get the IAM key and secret <a href="#IAM">How to set up</a>
  
- [Follow this instruction](https://help.smallbusiness.yahoo.net/s/article/SLN18861) to get your facebook app id and secret
  
- [Follow this instruction](https://developers.google.com/maps/documentation/javascript/get-api-key) to get your google app id and secret

---

## set up .env file
- create a dotenv file and enter the require data as below

<img src="https://d39wlfkh0mxxlz.cloudfront.net/Annotation 2020-05-19 165740.png">

---

## How to set up cloudFRONT
- Original Domain name is the S3 bucket that you created

<img id="cloudFront" src="https://camo.githubusercontent.com/7c1c3f3b43e4320092bffbd5ded6124c8f8b1102/68747470733a2f2f692e6962622e636f2f3176387a4747472f636c6f75642d46726f6e742e706e67">

## How to set up IAM

<img id="IAM" src="https://d39wlfkh0mxxlz.cloudfront.net/Screen Shot 2020-05-22 at 3.04.52 AM.png" />


### if any question feel free to create a issue
