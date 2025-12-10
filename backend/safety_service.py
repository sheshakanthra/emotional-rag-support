class SafetyService:
    dangerous_keywords = [
        "suicide", "kill myself", "end my life", "want to die",
        "self harm", "hurt myself"
    ]

    def analyze_risk(self, text):
        text = text.lower()
        if any(word in text for word in self.dangerous_keywords):
            return "high_risk"
        return "ok"

    def crisis_message(self):
        return (
            "⚠️ I’m really concerned about your safety.\n"
            "Please reach out to a trusted person or local emergency services immediately.\n"
            "You deserve care, support, and understanding."
        )
