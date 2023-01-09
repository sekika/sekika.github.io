ESFLAGS := --fix
UGFLAGS := --comments /.*MIT.*/ --verbose --warn

all: canvasevent.min.js graph.min.js 15.min.js unsoda.min.js

%.min.js: %.js
	eslint $(ESFLAGS) $<
	uglifyjs $(UGFLAGS) $< > $@

install:
	npm install -g eslint uglify-js

.PHONY: install
