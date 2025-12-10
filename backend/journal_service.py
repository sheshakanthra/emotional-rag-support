from db_service import DatabaseService

class JournalService:
    def __init__(self):
        self.db = DatabaseService()

    def write_entry(self, user_id, text):
        self.db.insert_journal_entry(user_id, text)

    def get_entries(self, user_id):
        return self.db.get_journals_by_user(user_id)
