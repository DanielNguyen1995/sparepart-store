# sparepart-store
Udacity capstone project (serverless)

## Description
This application is a spare part warehouse stock management application that allow factory to manage their stock of machine spare part.
The application include with both serverless back-end and front-end modules.

## Note
This project is based on the starter code of project-04 in `cloud-developer` repository provided in Udacity Cloud Developer course.
All the deployment and run steps are similar to the project Serverless Application.

## Usage
### 1. Installation
Clone the repository to your local machine, then cd to `./client`, run the client service with command:

`npm install` or use with (`--force`) if any installation issue occurred

### 2. Start-up client at local
Run the client service with command:

`npm run start`

After the UI started successfully on local machine, the new browser windows will be automatically show up with URL: `http://localhost:3000/`

At the first time use, user need to register for their account and login with that credential before registering any of their projects.

### 3. Create/Delete part info
To create new part info, all the fields below should be provided:

- decription: what is the part? give a brief description (roll bearing, ...)
- vendor: name of the part's OEM (Original Equipment Manufacturer)
- vendorPartNum: original part number provided by the OEM
- inStock: stocked quantity of the part

You can also delete part info by clicking on the "Delete" button on each record row.

### 4. Upload part image
This action is done by clicking on the blue button and provide the image file. This file will then be uploaded to S3 bucket and show on the page.

### 5. Note
- All the fields need to be input with string with minimum length of 2.