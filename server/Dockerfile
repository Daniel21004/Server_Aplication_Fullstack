FROM maven:3.9.4-eclipse-temurin-17

# Create a /app directory and work on it
RUN mkdir -p  /app

# Copy the pom.xml file into /app
COPY pom.xml /app

# Download the dependencies with the 'go-offline' configuration for that the dependencies are avaible offline
RUN mvn -f /app/pom.xml dependency:go-offline

# Copy the source code to /app
COPY . /app
COPY src/main/resources/static/image /media/resource

RUN mvn -f /app/pom.xml clean package -Dmaven.test.skip=true

## The dockerfile of the api, wait for 20 seconds(min) until that the mysql_db is up
ENTRYPOINT ["sh", "-c", "sleep 20 && java -jar app/target/server-0.0.1-SNAPSHOT.jar"]


