ng build
cp Staticfile dist/front-end-experiment
cd dist/front-end-experiment
cf push cws-chart-test -b staticfile_buildpack
