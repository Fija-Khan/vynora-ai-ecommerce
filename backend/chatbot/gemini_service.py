
import json
import time

from google import genai
from google.genai import errors
from django.conf import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def generate_content_with_retry(prompt):
    for attempt in range(3):
        try:
            return client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
            )

        except errors.APIError as error:
            if error.code == 503 and attempt < 2:
                time.sleep(2 ** attempt)
                continue

            raise


def extract_product_criteria(message):
    prompt = f"""
Analyze this Vynora shopping request and return only valid JSON.

Fields:
gender, category, brand, color, product_name, min_price, max_price, min_discount

Use null when not mentioned.

User message:
{message}
"""

    response = generate_content_with_retry(prompt)

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(text)

        if isinstance(data, dict):
            return data

        return {}

    except json.JSONDecodeError:
        return {}


def generate_ai_response(message, products=None):
    product_context = ""

    if products:
        for product in products:
            product_context += f"""
ID: {product.id}
Name: {product.name}
Brand: {product.brand}
Category: {product.category.name}
Gender: {product.gender}
Price: ₹{product.price}
Discount: {product.discount_percent}%
Stock: {product.stock}
Description: {product.description}
"""

    prompt = f"""
You are Vynora AI shopping assistant.

User:
{message}

Available products:
{product_context}

Only recommend products from the available products.
Never invent product information.

If no products are available, clearly tell the user that no matching products were found.

Keep the answer concise and helpful.
"""

    response = generate_content_with_retry(prompt)

    return response.text

