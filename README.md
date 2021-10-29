## This is a multiple-container sample app for practicing Docker, Travis CI and deploying to AWS.  

### Dockerrun.aws.json config:
- a container's name is totally arbitrary.
- image refers to a previously deployed image on dockerhub.
- hostname is an optional alias that allows containers to refer to one another, similar to the running *services* in docker-compose.

_the 'essential' property:_  
- at least one container must be marked true.
- if an essential container crashes, all other containers are shut down.
- we're choosing to make our nginx container essential because all our other services depend on it.

_container links:_  
- refer to another container by name, NOT by hostname
- one-way connection to direct to another container.

_possible Elastic Beanstalk platform issues:_
- this app is configured to be deployed to EB's 64-bit Amazon Linux platform.
- this platform will be deprecated in June 2022.
- other platforms will require a different configuration process and possibly setting up separate docker-compose files.

_why are we using external services for redis & postgres in prod when they're just containers in dev?_
- AWS Elastic Cache automatically creates & maintains instances of professional-grade redis.
- AWS RDS does the same for postgres instances.
- RDS also has automatic backups and rollbacks.
- Super easy to scale if your application gets popular.
- Built in logging / maintenance.
- Better security than what we can provide with a standard container.
- Easier to migrate off EB if we have to.
- it's almost always easier (and safer) to use a managed data service provider over DIY solutions.

_notes on env vars:_
- every container in our Elastic Beanstalk instance has access to its env variables.
- these are set in the *Configuration* tab in the EB environment's dashboard.