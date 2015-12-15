UNAME = ${shell uname}

all:
	git add -A
	- git commit -m draft
	make preview

push:
	git add -A
	- git commit -m draft
	git push origin master
	make preview

preview:
	- if [ $(UNAME) = "Darwin" ]; then open http://localhost:4000/; fi
	- if [ $(UNAME) = "Linux" ]; then xdg-open http://localhost:4000/; fi
	cd ..; bundle exec jekyll serve --drafts --host localhost

index:
	../setup/index

linkcheck:
	# pip install linkchecker
	linkchecker http://sekika.github.io/
