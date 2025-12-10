import sqlite3


class DatabaseService:
    def __init__(self):
        self.conn = sqlite3.connect("data/emotional.db", check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.create_tables()

    # ✅ CREATE TABLES
    def create_tables(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password TEXT
            )
        """)

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS journals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                content TEXT
            )
        """)

        self.conn.commit()

    # ✅ CREATE USER (USED BY SIGNUP)
    def create_user(self, email: str, hashed_password: str):
        try:
            self.cursor.execute(
                "INSERT INTO users (email, password) VALUES (?, ?)",
                (email, hashed_password),
            )
            self.conn.commit()
            return self.cursor.lastrowid
        except sqlite3.IntegrityError:
            return None   # email already exists

    # ✅ GET USER BY EMAIL (USED BY LOGIN)
    def get_user_by_email(self, email: str):
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT id, password FROM users WHERE email = ?",
            (email,),
        )
        return cursor.fetchone()

    # ✅ SAVE JOURNAL ENTRY
    def insert_journal_entry(self, user_id: int, text: str):
        self.cursor.execute(
            "INSERT INTO journals (user_id, content) VALUES (?, ?)",
            (user_id, text),
        )
        self.conn.commit()

    # ✅ FETCH JOURNAL HISTORY (USED BY FRONTEND)
    def get_journals_by_user(self, user_id: int):
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT content FROM journals WHERE user_id = ? ORDER BY id ASC",
            (user_id,),
        )
        rows = cursor.fetchall()
        return [row[0] for row in rows]
