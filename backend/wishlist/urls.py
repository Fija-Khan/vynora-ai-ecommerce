from django.urls import path

from .views import (
    WishlistView,
    WishlistItemCreateView,
    WishlistItemDeleteView,
)


urlpatterns = [
    path(
        '',
        WishlistView.as_view(),
        name='wishlist-detail',
    ),

    path(
        'items/',
        WishlistItemCreateView.as_view(),
        name='wishlist-item-create',
    ),

    path(
        'items/<int:pk>/',
        WishlistItemDeleteView.as_view(),
        name='wishlist-item-delete',
    ),
]