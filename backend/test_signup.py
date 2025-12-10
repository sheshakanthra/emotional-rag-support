from auth_service import AuthService
import traceback

def test_signup():
    try:
        auth = AuthService()
        email = "test@gmail.com"
        password = "password123"
        
        print(f"Attempting to signup user: {email}")
        result = auth.signup(email, password)
        
        if result:
            print("Signup successful:", result)
        else:
            print("Signup failed.")
    except Exception:
        traceback.print_exc()

if __name__ == "__main__":
    test_signup()
