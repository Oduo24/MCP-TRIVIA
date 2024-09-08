import mysql.connector

connection = mysql.connector.connect(
            host='mcp-trivia-db-instance.c18ys0qg2qkp.af-south-1.rds.amazonaws.com',
            user='gerald',
            password='ruphinee',
            database='mcp_db'
        )

cursor = connection.cursor()

dump_file = './mcp_db.sql'

try:
    with open(dump_file, 'r') as file:
        sql_commands = file.read().split(';')  # Split the file into individual SQL commands

        for command in sql_commands:
            if command.strip():  # Avoid empty commands
                cursor.execute(command)
                connection.commit()  # Commit each command

    print("Dump file executed successfully.")

except Exception as err:
    print(f"Error: {err}")
    connection.rollback()  # Rollback in case of error