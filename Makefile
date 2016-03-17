all: build

build:
				jpm xpi

run:
				jpm -b /usr/bin/firefox run
