
#installation
npm install nodemon -g --save
npm install -g babel-cli
npm install mongodb --save
npm install socket.io --save

npm install

brew update
brew install mongodb
sudo mkdir -pv /data/db
sudo chown -R `id -un` /data/db

#setup mongodb

#run mongod server with replica set rs0
  mongod --port 27017 --smallfiles --oplogSize 50 --replSet rs0

#open a mongo client
  mongo --port 27017
  rs.initiate()
  use drola
#inert first document to the database to initiate
  db.projects.insert({"score":"sustainable computing research projects"})

#configuration
  set the values for the constants defined in Application_server/config.js file.

#run Application server
cd your_path_to_project_root/Application_server
npm start

#Connecting to Web server through web client
Then open a browser tab and goto the following url it will see all the locations of the live End Nodes.
http://localhost:3000/
