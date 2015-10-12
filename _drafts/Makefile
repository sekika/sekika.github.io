# This Makefile only works with Mac, because it uses open command.

all:
	git add -A
	- git commit -m draft
	git push origin master
	open http://localhost:4000/
	cd ..; jekyll serve --drafts --host localhost
