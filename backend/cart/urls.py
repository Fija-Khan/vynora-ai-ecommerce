from django.urls import path

from .views import (
    CartView,
    CartItemCreateView,
    CartItemUpdateDeleteView,
)


urlpatterns = [
    path(
        '',
        CartView.as_view(),
        name='cart-detail',
    ),

    path(
        'items/',
        CartItemCreateView.as_view(),
        name='cart-item-create',
    ),

    path(
        'items/<int:pk>/',
        CartItemUpdateDeleteView.as_view(),
        name='cart-item-detail',
    ),
]