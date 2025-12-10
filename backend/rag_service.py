import os
import pickle
import time
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from gemini_client import embed_text, generate_text


MEMORY_LIMIT = 5          # ✅ keep last 5 journals only
TIME_WINDOW = 24 * 3600   # ✅ 24 hours relevance window


class RagService:
    def __init__(self, user_id):
        self.user_id = user_id
        self.path = f"data/embeddings/{user_id}.pkl"
        self.vectors = []
        self.texts = []
        self.timestamps = []

        if os.path.exists(self.path):
            with open(self.path, "rb") as f:
                data = pickle.load(f)
                self.vectors = data.get("vectors", [])
                self.texts = data.get("texts", [])
                self.timestamps = data.get("timestamps", [])

    def _save(self):
        os.makedirs("data/embeddings", exist_ok=True)
        with open(self.path, "wb") as f:
            pickle.dump({
                "vectors": self.vectors,
                "texts": self.texts,
                "timestamps": self.timestamps
            }, f)

    # ✅ SAVE JOURNAL WITH TIME
    def index_new_entry(self, text):
        now = time.time()
        vec = embed_text(text)

        self.vectors.append(vec)
        self.texts.append(text)
        self.timestamps.append(now)

        # ✅ Keep only last N journals
        if len(self.texts) > MEMORY_LIMIT:
            self.vectors = self.vectors[-MEMORY_LIMIT:]
            self.texts = self.texts[-MEMORY_LIMIT:]
            self.timestamps = self.timestamps[-MEMORY_LIMIT:]

        self._save()

    # ✅ REPLY BASED ON RECENT JOURNAL ONLY
    def build_reply(self, query):
        # ✅ If no journals exist, block generic AI
        if not self.texts:
            return "You haven’t written any journal entries yet. Please write one first so I can reflect with you."

        # ✅ STRICT MODE: USE ONLY THE MOST RECENT JOURNAL
        latest_journal = self.texts[-1]

        prompt = f"""
You are an emotional support assistant.

You MUST answer ONLY using the journal below.
You are NOT allowed to use any older memory or general psychology knowledge.

Latest journal:
"{latest_journal}"

User question:
"{query}"

Give a warm, emotionally supportive reply strictly based on the journal.
"""

        return generate_text(prompt)


