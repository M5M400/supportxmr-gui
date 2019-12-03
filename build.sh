#!/bin/bash 
# sudo npm install -g uglifycss uglify-js html-minifier

uglifycss --output build/style_min.css style.css &&\
uglifyjs  --output build/script_min.js script.js &&\
html-minifier --output build/index.html index.html &&\
echo OK