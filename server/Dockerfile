#FROM eclipse-temurin:20
#COPY target/server-0.0.1-SNAPSHOT.jar server-app.jar
#COPY src/main/resources/static/image /media/resource
##ENTRYPOINT ["java", "-jar", "server-app.jar"]
#
## The dockerfile of the api, wait for 15 seconds(min) until that the mysql_db is up
#ENTRYPOINT ["sh", "-c", "sleep 20 && java -jar server-app.jar"]

FROM eclipse-temurin:20

# Install Maven
RUN apt-get update && apt-get install -y maven

# Create a /app directory and work on it
RUN mkdir -p  /app

# Copia el archivo pom.xml y el código fuente
COPY pom.xml /app

# Download the dependencies with the 'go-offline' configuration for that the dependencies are avaible offline
RUN mvn -f /app/pom.xml dependency:go-offline

# Copy the source code to /app
COPY . /app
COPY src/main/resources/static/image /media/resource

RUN mvn -f /app/pom.xml clean package -Dmaven.test.skip=true

#COPY app/target/server-0.0.1-SNAPSHOT.jar server-app.jar

ENTRYPOINT ["sh", "-c", "sleep 20 && java -jar app/target/server-0.0.1-SNAPSHOT.jar"]
#ENTRYPOINT ["sh", "-c", "sleep 20 && java -jar /app/target/server-0.0.1-SNAPSHOT.jar"]


