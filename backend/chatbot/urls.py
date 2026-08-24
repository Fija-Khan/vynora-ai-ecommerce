from django.urls import path

from .views import (
    ChatConversationListCreateView,
    ChatConversationDetailView,
    ChatMessageListCreateView,
)


urlpatterns = [
    path(
        'conversations/',
        ChatConversationListCreateView.as_view(),
        name='conversation-list-create',
    ),

    path(
        'conversations/<int:pk>/',
        ChatConversationDetailView.as_view(),
        name='conversation-detail',
    ),

    path(
        'messages/',
        ChatMessageListCreateView.as_view(),
        name='message-list-create',
    ),
]