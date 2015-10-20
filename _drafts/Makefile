UNAME = ${shell uname}

all:
	git add -A
	- git commit -m draft
	git push origin master
	if [ $(UNAME) = "Darwin" ]; then open http://localhost:4000/; fi
	if [ $(UNAME) = "Linux" ]; then xdg-open http://localhost:4000/; fi
	cd ..; jekyll serve --drafts --host localhost
