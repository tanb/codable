clean:
	rm -rf dist

publish: clean
	npm version patch
	npm publish
