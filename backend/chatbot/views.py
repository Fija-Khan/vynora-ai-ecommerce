from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import ChatConversation, ChatMessage
from .serializers import (
    ChatConversationSerializer,
    ChatMessageSerializer,
)
from .gemini_service import generate_ai_response


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

    def perform_create(self, serializer):

        # Save user's message
        user_message = serializer.save(
            role='user'
        )

        # Generate AI response using Gemini
        ai_response = generate_ai_response(
            user_message.message
        )

        # Save AI response
        ChatMessage.objects.create(
            conversation=user_message.conversation,
            role='assistant',
            message=ai_response
        )