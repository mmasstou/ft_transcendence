
#!/bin/bash


# ! create database on mac OS
# Database name
DB_NAME="db_chat"
DB_USER="mmasstou"
DB_PASSWORD="mmasstou_012345"

# Connect to PostgreSQL and create the database
psql -c "CREATE DATABASE $DB_NAME;"


# Create the database user and set the password
# psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"


# # Create a PostgreSQL user
createuser -P $DB_USER


createdb $DB_NAME

# Set the user's password
psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
ALTER USER mmasstou WITH PASSWORD 'mmasstou_012345';

# Grant privileges to the user on the database
psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
GRANT ALL PRIVILEGES ON DATABASE db_chat TO mmasstou ;