import sqlite3

conn = sqlite3.connect("data/global.db")
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(journal)")
print(cursor.fetchall())

conn.close()
