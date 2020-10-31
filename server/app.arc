@app
photoblog-upload-server

@aws
apigateway http
region eu-central-1
bucket ek-geloets-installationen-ftw

@http
get /
get /favicon.ico
get /static/:type/:filename

post /
post /logout

any /*

@macros
custom-domain
herschel666-arc-macros-custom-log-groups
