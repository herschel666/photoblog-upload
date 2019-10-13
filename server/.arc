@app
photoblog-upload-server

@aws
region eu-central-1
profile ek-photo-upload
bucket ek-photo-upload-deploy-bucket

@http
get /
get /favicon.ico
get /static/:type/:filename

post /
post /logout

@macros
custom-domain
custom-log-groups
