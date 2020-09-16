# Get started

execute command for mysql database
```
docker run --name mysql -e MYSQL_DATABASE=testdb -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:5
```
After that, execute a command to list available options
```
ts-node index.ts
```

For example
```
ts-node index.ts user
```