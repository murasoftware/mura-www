# Mura Run Book
## Table of Contents

 1. [Acquire Environment](#acquire-environment)
 2. [Getting Started](#getting-started) 
 3. [Local Environment](#local-environment)
 4. [Developing Components w/ ReactJS and NextJS](#developing-components-w-reactjs-and-nextjs)
 5. [Mura Component Docs](#mura-component-docs)
 6. [Mura Environment Variable Guide](#mura-environment-variable-guide)
 7. [CI/CD Process](#cicd-process)
 8. [Advanced Local Development Options](#advanced-local-development-optionsexperimental)

## Acquire Environment
### Currently
For Partners
 1. Send MaryAnne preferred project name and projected monthly requests
    and sessions  
 2. Send MaryAnne Github user names
 3. MaryAnne will contact hosting support
 4. Hosting support will create a review and production environment for
    NextJS and Mura(4 environments total)
 5. Hosting support will grant access to github
 6. MaryAnne will reply withurls and login information for Github and
    Mura environments
    
### Projected Q4
 1. Official partners will be granted to a partner portal
 2. Log in to partner portal interface
 3. Create new project
 4. Deploy project
 5. Receive instructions on environments and repositories

## Getting Started
### Required Install:
- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/downloads)
- [NodeJS](https://nodejs.org/en/)
- [VS Code](https://code.visualstudio.com/) (optional - you can use preferred text editor)
- [cmder](https://cmder.net/)

## Local Environment
1. You will be supplied with both a front-end and back-end repositories
   1. Your back-end repository will be named `<partner-name>-<partner-project>`
   2. Your front-end repository will be named `<partner-name>-<partner-project>-www`
2. Please clone the front-end and backend repositories to your local folder either using `git clone` or downloading zipped source from Github
3. Open terminal and run `cd <path-to-my-back-end> && git checkout review && docker-compose up`
4. Open another terminal and run `cd <path-to-my-front-end> && git checkout review && npm install && npm run dev`
5. Open your browser and go to http://localhost:3000/ and wait for Mura to create your database and initial configuration
6. Once the initial configuration is set, copy the file mura.config.json from your project folder to the folder mura/app/config
7. In mura/app/config open the file settings.ini.cfm and set the value for externalconfig to “/var/www/config/mura.config.json”
8. Reload your mura instance using http://localhost:8888/admin/?appreload or you can stop the backend and launched again with:
    - run `docker-compose down`
    - run `docker-compose up`

## Developing Components w/ ReactJS and NextJS
ReactJS is perhaps the most pervasive JavaScript framework globally at this point in time and for many years. NextJS is one of, if not the largest and most supports NodeJS server framework globally. Bootstrap is one of the most wellknow HTML/JS/CSS framework out there. So we chose React-Bootstrap to build Mura modules moving forward. Mura has chosen to move in the direction of ubiquity to strengthen and expand the community.  

Below are the links to each frameworks documentation:
- [ReactJS](https://reactjs.org/docs/getting-started.html)
- [NextJS](https://nextjs.org/docs/getting-started)
- [React-Bootstrap](https://react-bootstrap-v4.netlify.app/)

To create new components there are 3 steps:
1. In <project>-www directory navigate to ./src/components
   1. Copy the "Example" component and paste in the same directory
   2. Rename directory to your component name with, make sure to capitalize with no spaces or special-characters and camel-case. (i.e ExampleComponent)
   3. Open the folder, rename Example.js and Example.module.scss to \<YourComponent\>.js and \<YourComponent\>.module.scss respectively.
   4. Inside Index.js change the code from  
  
   ```
   import Example from './Example'
   export default Example;
   ```
   to  (implied that <YourComponent> is what you named the component without the "<" and ">")

   ```
   import <YourComponent> from './<YourComponent>'
   export <YourComponent>;
   ```
   and in \<YourComponent\>.js change 

   ```
    import React from 'react';
    import styles from './Example.module.scss';

    function Example({myvar}) {
    // console.log("Component -> Text: ", props);

    return (
        <div>
            <h3 className={styles.label}>{myvar || 'Enter example variable in configurator'}</h3>
        </div>
        );
    }

    export default Example;
   ```
   to  (implied that <YourComponent> is what you named the component without the "<" and ">")  

   ```
    import React from 'react';
    import styles from './<YourComponent>.module.scss';

    function <YourComponent>({myvar}) {
    // console.log("Component -> Text: ", props);

    return (
        <div>
            <h3 className={styles.label}>{myvar || 'Enter example variable in configurator'}</h3>
        </div>
        );
    }

    export default <YourComponent>;
   ```
2. Open ./mura.config.js and import your component to the file with the other components
   ```
   import <YourComponent> from '@components/<YourComponent>';
   ```
   then register the component in the moduleRegustry object

   ```
   {
    name: '<YourComponent>',
    component: <YourComponent>,
    },
   ```
3. Register your component in the mura.config.json in the modules object
   ```
   "<YourComponent>": {
        "name": "<YourComponent>",
        "contenttypes": "*",
        "iconclass": "mi-file-photo-o", 
        "contenttypes": "*",
        "omitcontenttypes": "",
        "configurator": [
            { "type": "text", "name": "domain", "label": "Domain" }
            { "type": "select", "name": "color", "label": "Color", "labels": ["Red", "Green", "Blue"], "options": ["red", "green", "blue"], "value": "red" },
            { "type": "radio", "name": "showitem", "label": "Show Item", "labels": ["Yes", "No"], "options": ["true", "false"], "value": "false" },
            { "type": "toggle", "name": "darkmode", "label": "Dark Mode", "value": "false", "condition": "this.showitem==='true'" },
            { "type": "fieldlist", "name": "fields", "label": "Display List" },
            { "type": "name_value_array", "name": "customlinks", "label": "Links" },
            { "type": "file", "name": "brandimage", "label": "Brand Image" }
        ]
    },
    ```
## Mura Component Docs
### Component Properties
#### Component Property: Type(type)
This is the native type of the input. It describes how the field is displayed while authoring(radio, checkbox, select, etc...)
#### **Component Property: Name(name)**
This is the name of your component as a label and how it will be read in the layout manager 
#### **Component Property: Content Types(contenttypes)**
//TODO need a proper description here
#### **Component Property: Icon Class(iconclass)**
This is a class in the them that you want to represent your component in the Layout Manager
#### **Component Property: Omit Content Types(omitcontenttypes)**
//TODO need a proper description here

### Configurator Types
#### **Configurator Type: Text(text)**
Use this field for short strings like lables, ids or city names,
```
{ "type": "text", "name": "textname", "label": "Text Label" }
```
#### **Configurator Type: Select(select)**
Use this field for array based needs. This is to select one of many. 

**Note:** you must make sure that the labels and corresponding options are in the same order in the label and option arrays. If this is not done correctly you will not get your expected values on the unsynced options.*
```
    {   
        "type": "select", 
        "name": "color", 
        "label": "Color", 
        "labels": [
            "Red", 
            "Green",
            "Blue"
        ], 
        "options": [
            "red", 
            "green", 
            "blue"], 
        "value": "red" 
    },
```
#### **Configurator Type: Radio(radio)**
This is used for boolean needs. True/False returned value.

***Note:** you must make sure that the labels and corresponding options are in the same order in the label and option arrays. If this is not done correctly you will not get your expected values on the unsynced options.*
```
    { 
        "type": "radio", 
        "name": "showitem", 
        "label": "Show Item", 
        "labels": [
            "Yes", 
            "No"
        ], 
        "options": [
            "true", 
            "false"
        ], 
        "value": "false" 
    },
```

#### **Configurator Type: Toggle(toggle)**
This is used for boolean needs. True/False returned value.

//TODO: Needs explanation for the condition property

```
    { 
        "type": "toggle", 
        "name": "darkmode", 
        "label": "Dark Mode", 
        "value": "false", 
        "condition": "this.showitem==='true'" 
    },
```

#### **Configurator Type: Field List(fieldlist)**
Field list is for collections and which properties should be used by a component.

//TODO: I think the description is incorrect

```
    { 
        "type": "fieldlist", 
        "name": "fields", 
        "label": "Display List" 
    },
```
#### Configurator Type: **Name Value Array(name_value_array)**
This is used when you need a key value pair in a component
```
    { 
        "type": "name_value_array", 
        "name": "customlinks", 
        "label": "Links" 
    },
```

#### Configurator Type: **File(file)**
This is used when you need to get a url to Mura managed file.
```
    { 
        "type": "file", 
        "name": "brandimage", 
        "label": "Brand Image" 
    },
```

## Mura Environment Variable Guide
//TODO Matt needs to fil out this section
## CI/CD Process
1. When getting started it may be a good idea to working from the “review” branch of the repository.
2. There are two repository branches that are tied to the devops pipeline their names are “review” and “master”
    1.  “review” is plugged into an autodeploy pipeline that is triggered on push or merge.
        - In a back-end repository mura is built and output to https://\<partner-name\>-\<partner-project\>.review.murasoftware.com
        - In a front-end repository mura is built and output to https://\<partner-name\>-\<partner-project\>-www.review.murasoftware.com
    2. "master" - tbd

## Advanced Local Development Options(experimental)
In some cases it may be necessary or quicker to develop your front-end locally and have it use the content on review. With a http://localhost configuration this is not possible because it will be communicating with review over https throwing a cookie error. To bypass this(mac only) use the following steps.

1. Install mkcert (only once)  
    In your terminal, run the following command:
    ```
    brew install mkcert
    brew install nss # if you use Firefox
    ```
2. Add mkcert to your local root CAs.  
   In your terminal, run the following command:
   ```
   mkcert -install
   ```
   This generates a local certificate authority (CA). Your mkcert-generated local CA is only trusted locally, on your device.
3. Generate a certificate for your site, signed by mkcert.  
   In your terminal, navigate to your site's root directory or whichever directory you'd like the certificates to be located at.  
   Then, run:
   ```
   mkcert localhost
   ```
   If you're using a custom hostname like mysite.example, run:  

   ```
   mkcert <partnername>-<projectname>-local.review.murasoftware.com
   ```
   The command above does two things:
   - Generates a certificate for the hostname you've specified
   - Lets mkcert (that you've added as a local CA in Step 2) sign this  
     
4. Configure your server  
    You now need to tell your server to use HTTPS (since development servers tend to use HTTP by default) and to use the TLS certificate you've just created.

    Create a file named server-local.js  
    ```
    var https = require('https');
    var fs = require('fs');
    const path = require('path');
    const { parse } = require('url');

    const next = require('next');
    const port = parseInt(process.env.PORT) || 3000;
    const dev = true;
    const app = next({ dev, dir: __dirname });
    const handle = app.getRequestHandler();

    var options = {
        key: fs.readFileSync( 'LOCAL_PATH_TO_GENERATED_KEY',), 
        cert:fs.readFileSync('LOCAL_PATH_TO_GENERATED_CERT',)
    };

    app.prepare().then(() => {
    https.createServer(options, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    })
    .listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on localhost:${port}`);
        });
    });
    ```

    Add the following to your scripts object in your package.json
    ```
    "scripts": {
        "start:local": "node server-local.js -p 3000", 
        …,
    }
    ```

5. Add your local domain hosts

   Add your \<partnername>-\<partner-project>.review.murasoftware.com to your known_hosts file  
   ([click for instructions](https://www.lexisclick.com/blog/update-hosts-file-mac-os-x/))
