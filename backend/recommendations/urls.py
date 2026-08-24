from django.urls import path

from .views import (
    UserProductInteractionListCreateView,
    UserProductInteractionDetailView,
)


urlpatterns = [
    path(
        '',
        UserProductInteractionListCreateView.as_view(),
        name='interaction-list-create',
    ),

    path(
        '<int:pk>/',
        UserProductInteractionDetailView.as_view(),
        name='interaction-detail',
    ),
]