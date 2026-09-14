all:

install:
	cd setup; make install-hook
	cd tools/minitype-pdf; npm install; npm run build
