#!/bin/bash 
# sudo npm install -g uglifycss uglify-js html-minifier

uglifycss --output build/style_min.css style.css &&\
uglifyjs  --output build/script_min.js script.js web_miner/miner.js &&\
uglifyjs  --output build/worker.js web_miner/worker.js &&\
cp web_miner/cn.min.js build/cn.min.js &&\
html-minifier --output build/index.html index.html --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true &&\
echo OK
