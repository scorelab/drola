mkdir -pv /data/db
npm install nodemon -g --save
npm install -g babel-cli

brew update
brew install mongodb
sudo mkdir -pv /data/db
sudo chown -R `id -un` /data/db

#run mongodb with replica set rs0
mongod --port 27017 --smallfiles --oplogSize 50 --replSet rs0

#open a mongo client
mongo --port 27017
rs.initiate()
use drola
db.projects.insert({"score":"sustainable computing research projects"})

npm install mongodb --save
npm install socket.io --save
