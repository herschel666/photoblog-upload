@app
photoblog-upload-server

@aws
region eu-central-1
# bucket your-deploy-s3-bucket-name

@http
get /
get /favicon.ico
get /static/:type/:filename
