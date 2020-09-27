# guirra-iot
Guirra IOT it's a ecosystem for internet of things with native integration with Amazon Alexa.
The project idea is developer a low cost smart home devices with quality, security and easy to install and use.


## Backend
A nestjs application to handler iot devices, alexa skill account linking (oauth 2.0).

## Frontend
Web interface to access, control and update iot devices.

## Lambda
Javascript function to receive commands from amazon alexa interpret and invoque backend api.

### Installation
After clone repository, install dependencies using command "yarn install" or "npm i" inside backend, frontend and lambda/skill

#### backend:
- development run "yarn start:debug" or "npm run start:debug"
- build run "yarn build" or "npm run build"
- production after build run "yarn start:prod" or "npm run start:prod"

#### frontend
- development run "yarn serve" or "npm run serve"
- build run "yarn build" or "npm run build"
- production copy build files in dist/ put on a server for apache, nginx or another way to run static pages

### lambda
you can create a serverless file to run lambda or makeing deploy with zip file in this case remeber to send only build files.

### Running

1 - First, yout need create a lambda function to interpret alexa interface, use lambda function in lambda/skill.

2 - create a Alexa Home skill (visite [alexa tutorial for this](https://developer.amazon.com/en-US/docs/alexa/smarthome/understand-the-smart-home-skill-api.html)) 
and put the lambda function ARN.

3 - Get iot endpoint on IOT core.

4 - Create or get user credentials key id, key secret on AWS IAM.

5 - Get client id and cliente secret for account linking on alexa console.

6 - Run backend with environment variables, exemple in .env.example.

7 - Run frontend with environment variables, exemple in .env.example.

8 - Create a oauth client for alexa.

9 - Create a oauth client for frontend and set with default.

10 - Configure account linking on alexa developer console, in "Web Authorization URI" put https://backend-address/oauth/dialog , "Access Token URI" 
use https://frontend-address/v1/oauth/token then put alexa client id and secret

11 - Done, now just add your devices, visit the [devices repository](https://github.com/tiagoguirra/iot-devices)
