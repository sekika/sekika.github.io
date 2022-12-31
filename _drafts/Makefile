UNAME = ${shell uname}
RUBY_PATH = /opt/homebrew/opt/ruby/bin

all: push

push:
	git add -A
	- git commit -m draft
	git push origin master
	make preview

preview:
	- if [ $(UNAME) = "Darwin" ]; then open http://localhost:4000/; fi
	- if [ $(UNAME) = "Linux" ]; then xdg-open http://localhost:4000/; fi
	cd ..; $(RUBY_PATH)/bundle exec jekyll serve --drafts --host localhost

index:
	../setup/index
	git add ../js/index.js
	git commit -m index
	git push origin master

linkcheck:
	# pip install linkchecker
	linkchecker http://sekika.github.io/

reinstall:
	rm -f ../Gemfile.lock
	$(RUBY_PATH)/bundle install
