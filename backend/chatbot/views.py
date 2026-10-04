from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ChatConversation, ChatMessage
from .serializers import ChatConversationSerializer, ChatMessageSerializer
from .gemini_service import (
    generate_ai_response,
    extract_product_criteria,
)
from .product_service import search_products


class ChatConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatConversation.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class ChatConversationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ChatConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatConversation.objects.filter(
            user=self.request.user
        )


class ChatMessageListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(
            conversation__user=self.request.user
        )

    def create(self, request, *args, **kwargs):
        user_message = ChatMessage.objects.create(
            conversation_id=request.data.get("conversation"),
            role="user",
            message=request.data.get("message"),
        )

        criteria = extract_product_criteria(
            user_message.message
        )

        products = search_products(criteria)

        ai_response = generate_ai_response(
            user_message.message,
            products
        )

        ChatMessage.objects.create(
            conversation=user_message.conversation,
            role="assistant",
            message=ai_response
        )

        product_data = []

        for product in products:
            product_data.append({
                "id": product.id,
                "name": product.name,
                "brand": product.brand,
                "price": float(product.price),
                "discount_percent": product.discount_percent,
                "image": (
                    product.image.url
                    if product.image
                    else None
                ),
                "category": product.category.name,
            })

        return Response({
            "message": ai_response,
            "products": product_data,
        })