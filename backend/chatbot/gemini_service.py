from google import genai
from django.conf import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def generate_ai_response(message):
    response = client.models.generate_content(
         model="gemini-3.6-flash",
        contents=message,
    )

    return response.text