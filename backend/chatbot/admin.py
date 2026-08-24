from django.contrib import admin

from .models import ChatConversation, ChatMessage


@admin.register(ChatConversation)
class ChatConversationAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'title',
        'created_at',
        'updated_at',
    )

    search_fields = (
        'user__username',
        'user__email',
        'title',
    )

    list_filter = (
        'created_at',
        'updated_at',
    )


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'conversation',
        'role',
        'created_at',
    )

    search_fields = (
        'message',
        'conversation__user__username',
        'conversation__user__email',
    )

    list_filter = (
        'role',
        'created_at',
    )