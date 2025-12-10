import sqlite3

def check_users():
    try:
        conn = sqlite3.connect("data/emotional.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, email, password FROM users")
        users = cursor.fetchall()
        
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"ID: {user[0]}, Email: {user[1]}, Password Hash: {user[2][:20]}...")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_users()
