from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth_service import AuthService
from journal_service import JournalService
from rag_service import RagService

# ✅ Create app
app = FastAPI(title="Emotional Support RAG API")

# ✅ ENABLE CORS (Frontend Access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Services
auth = AuthService()
journal = JournalService()

# ✅ Request Models
class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ChatRequest(BaseModel):
    user_id: int
    message: str


# ✅ AUTH ROUTES
@app.post("/signup")
def signup(data: SignupRequest):
    result = auth.signup(data.email, data.password)
    if not result:
        return {"success": False, "message": "Signup failed"}
    return {
        "success": True,
        "user_id": result["user_id"],
        "token": result["token"]
    }


@app.post("/login")
def login(data: LoginRequest):
    result = auth.login(data.email, data.password)

    if not result:
        return {"success": False, "message": "Login failed"}

    return {
        "success": True,
        "user_id": result["user_id"],
        "token": result["token"]
    }




# ✅ AI CHAT (JOURNAL-AWARE)
@app.post("/chat")
def chat(data: ChatRequest):
    try:
        print("CHAT:", data.user_id, data.message)

        rag = RagService(data.user_id)
        reply = rag.build_reply(data.message)

        return {"reply": reply}

    except Exception as e:
        print("CHAT ERROR:", str(e))
        return {"reply": "⚠️ AI service error. Try again later."}


# ✅ JOURNAL SAVE + EMBEDDING MEMORY (CRASH-PROOF)
@app.post("/journal")
def save_journal(data: ChatRequest):
    try:
        print("🧠 Journal incoming:", data.user_id, data.message)

        journal.write_entry(data.user_id, data.message)

        rag = RagService(data.user_id)
        rag.index_new_entry(data.message)  # ✅ NOW THIS WILL WORK

        return {
            "success": True,
            "message": "Journal saved successfully"
        }
    except Exception as e:
        print("❌ JOURNAL SAVE FAILED:", str(e))
        return {
            "success": False,
            "message": "Backend journal save failed"
        }




# ✅ HEALTH CHECK
@app.get("/")
def health_check():
    return {"status": "Backend is running ✅"}


@app.get("/journal/{user_id}")
def get_journals(user_id: int):
    entries = journal.get_entries(user_id)
    return {
        "success": True,
        "entries": entries
    }



