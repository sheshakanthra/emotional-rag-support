from openai import OpenAI
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import numpy as np

# ✅ Load API Key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Local Embeddings (No API / No Quota)
embedder = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text: str):
    embedding = embedder.encode([text])[0]
    return np.array(embedding)


# ✅ AI Text Generation (Stable & Powerful)
def generate_text(prompt: str):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a calm, emotionally supportive AI assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("⚠️ OpenAI Error:", e)
        return "I'm here for you. You're not alone. Please take a breath and try again."
