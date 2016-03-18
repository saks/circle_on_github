all: build

build:
				jpm xpi

run:
				jpm -b /usr/bin/firefox run

clean:
				rm ./*.xpi

sign: clean build
				jpm sign --api-key ${AMO_API_KEY} --api-secret ${AMO_API_SECRET} --xpi *.xpi
