# from auth_service import AuthService
# from journal_service import JournalService
# from rag_service import RagService


# def main():
#     print("🧠 Emotional Support RAG Assistant\n")

#     auth = AuthService()

#     print("1) Sign Up")
#     print("2) Login")
#     choice = input("> ").strip()

#     # ---------- SIGN UP ----------
#     if choice == "1":
#         email = input("Email: ").strip()
#         pwd = input("Password: ").strip()

#         user_id = auth.signup(email, pwd)

#         if not user_id:
#             print("❌ Signup failed")
#             return

#         print("✅ Signup successful")

#     # ---------- LOGIN ----------
#     elif choice == "2":
#         email = input("Email: ").strip()
#         pwd = input("Password: ").strip()

#         user_id = auth.login(email, pwd)

#         if not user_id:
#             print("❌ Login failed")
#             return

#         print("✅ Login successful")

#     # ---------- INVALID INPUT ----------
#     else:
#         print("❌ Invalid choice. Please enter 1 or 2.")
#         return

#     # ---------- AFTER LOGIN ----------
#     journal = JournalService()
#     rag = RagService(user_id)

#     print("\nCommands:")
#     print(" journal <text>")
#     print(" quit\n")

#     while True:
#         msg = input("You: ").strip()

#         if msg == "quit":
#             print("👋 Goodbye!")
#             break

#         if msg.startswith("journal "):
#             text = msg.replace("journal ", "", 1).strip()
#             journal.write_entry(user_id, text)
#             rag.index_new_entry(text)
#             print("📓 Saved")
#             continue

#         reply = rag.build_reply(msg)
#         print("\nAI:", reply, "\n")


# if __name__ == "__main__":
#     main()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth_service import AuthService
from journal_service import JournalService
from rag_service import RagService

# ------------------ APP SETUP ------------------

app = FastAPI(title="Emotional Support RAG API")

# ✅ CORS FIX (Frontend ↔ Backend Connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ SERVICES ------------------

auth = AuthService()
journal = JournalService()

# ------------------ REQUEST MODELS ------------------

class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ChatRequest(BaseModel):
    user_id: int
    message: str

# ------------------ API ENDPOINTS ------------------

@app.post("/signup")
def signup(data: SignupRequest):
    user_id = auth.signup(data.email, data.password)

    if not user_id:
        return {
            "success": False,
            "message": "Signup failed (user may already exist)"
        }

    return {
        "success": True,
        "user_id": user_id
    }


@app.post("/login")
def login(data: LoginRequest):
    user_id = auth.login(data.email, data.password)

    if not user_id:
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    return {
        "success": True,
        "user_id": user_id
    }


@app.post("/chat")
def chat(data: ChatRequest):
    rag = RagService(data.user_id)
    reply = rag.build_reply(data.message)

    return {
        "reply": reply
    }


@app.post("/journal")
def save_journal(data: ChatRequest):
    try:
        print("📥 Journal incoming:", data.user_id, data.message)

        journal.write_entry(data.user_id, data.message)

        rag = RagService(data.user_id)
        rag.index_new_entry(data.message)

        print("✅ Journal saved + embedded successfully")

        return {
            "success": True,
            "message": "Journal saved successfully"
        }

    except Exception as e:
        print("❌ JOURNAL SAVE FAILED:", str(e))

        return {
            "success": False,
            "message": "Backend error while saving journal"
        }



# ------------------ HEALTH CHECK ------------------

@app.get("/")
def health_check():
    return {
        "status": "Backend is running ✅"
    }

