from rest_framework import serializers

from .models import ChatConversation, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatMessage

        fields = [
            'id',
            'conversation',
            'role',
            'message',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'role',
            'created_at',
        ]


class ChatConversationSerializer(serializers.ModelSerializer):

    messages = ChatMessageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = ChatConversation

        fields = [
            'id',
            'user',
            'title',
            'messages',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'user',
            'messages',
            'created_at',
            'updated_at',
        ]