ESFLAGS := --fix
UGFLAGS := --comments /.*MIT.*/ --verbose --warn

all: canvasevent.min.js graph.min.js 15.min.js dodgem.min.js unsoda.min.js matchequity.min.js

%.min.js: %.js
	eslint $(ESFLAGS) $<
	uglifyjs $(UGFLAGS) $< > $@

install:
	arch -arm64 brew install node
	npm install -g eslint uglify-js

.PHONY: install
