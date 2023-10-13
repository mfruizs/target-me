# Target Me

This is a service specialized in answering [Http Status Codes](#http-status-codes) so that we can test services. 
It offers the possibility of being able to return [custom headers](#custom-headers) and even make the service have a [specific timeout](#timeout-parameter).
The service is prepared to allow requests using CORS.

Another capability is the ability to answer custom status codes, which are defined in the [**status.json**](./config/status.json) file.
Feel free to make any changes or make a PR to modify it in the project.

Once the project is deployed, we will be able to see its documentation through its [home page](./html/index.html), 
which can be visited by simply visiting **root domain** ( [localhost example](https://localhost:3000/) )

## Run application

The service has defined a series of Script commands to start and validate that everything is correct.

| Command                      | Description                                         |
|------------------------------|-----------------------------------------------------|
| ```npm run start```          | Run sever with [local](./cert) certificates (https) |
| ```npm run start:insecure``` | Run server without using local certificates (http)  |
| ```npm run test```           | Run jest                                            |
| ```npm run test:all```       | Run all tests                                       |
| ```npm run test:util```      | Run utilities tests                                 |
| ```npm run test:service```   | Run service tests                                   |
| ```npm run test:api```       | Run integration tests                               |

Executable to run application in local:
```sh
npm run start
```

## Dockerized

| Command                                                                                     | Description                                        |
|---------------------------------------------------------------------------------------------|----------------------------------------------------|
| ```docker build . -t mfruiz/target-me```                                                    | Create docker image                                |
| ```docker run -p 3000:3000 mfruiz/target-me```                                              | Use docker image                                   |
| ```docker run -p 3000:3000 -e CERTIFICATE_PATH=/custom/certificate/path mfruiz/target-me``` | Start Up docker image with custom certificate path |

Executable for command to build the docker image: 
```sh
docker build . -t mfruiz/target-me
```

## Http status codes

The purpose of the service is to receive a PathVariable which contains the expected status code and even to be able to send a list 
or range of codes that can be returned.

* **simple**:  https://localhost:3000/{statusCode}
* **with sleep**:  https://localhost:3000/{statusCode}?sleep=
* **code list**:  https://localhost:3000/random/{statusCode},{statusCode},{statusCode}
* **code range**:  https://localhost:3000/random/{statusCode}-{statusCode}

Examples:

| Description            | url                                           |
|------------------------|-----------------------------------------------|
| 200 with 2s Sleep      | https://localhost:3000/200?sleep=2            |
| 504 with 2s Sleep      | https://localhost:3000/504?sleep=2            |
| statusCode 504         | https://localhost:3000/503                    |
| StatusCode under 200   | https://localhost:3000/199                    |
| No existing statusCode | https://localhost:3000/1000                   |
| Random statusCode      | https://localhost:3000/random/200,203,500-504 |


## Custom headers

In case we need to receive response headers from the service, we can do it by adding them in the request headers.

To do this, we must add a header that has the following prefix `X-TargetMe-header-`

**Request header:**
`X-TargetMe-header-foo: bar`

**Response header:**
`foo: bar`


## Timeout parameter
The service has a single query param with which we can make it have a response delay of N seconds.

To do this operation is as simple as adding `?sleep=2` and we will be waiting 2 seconds

## Certification

In the example I have added a self-signed certificate by me as an example on [./cert](./cert) folder

This certificate will not be loaded in the Docker image, to add your own certificate, use `CERTIFICATE_PATH`.
when running the docker image and indicate the path where the following files are located.

* [cert.pem](cert%2Fcert.pem)
* [csr.pem](cert%2Fcsr.pem)
* [key.pem](cert%2Fkey.pem)

> **Important:** We will need to have the 3 files with the same name that exist in the example.
> The service will validate the existence of these certificates and that they are valid to be able 
> to start with the [https scheme](https://en.wikipedia.org/wiki/HTTP).


 # Disclaimer

The goal of this project is to improve my programming knowledge in **Node.js**,
and for that, what better than using as an example of existing project https://httpstat.us/
created in another language (**C#**)

All coding has been done from zero and will be done in the most efficient way and using
the least number of libraries necessary to do it.

In other words, it is my own alternative to '**httpstat.us**' website/project for
external connection testing.

I would like to thank the creators of **Httpstat.us** project ( [AARON POWELL](https://www.aaron-powell.com/) and [TATHAM ODDIE](https://tath.am/) ) 
for doing a great job that I think has helped many developers.