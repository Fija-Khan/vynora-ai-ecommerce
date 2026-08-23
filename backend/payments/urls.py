from django.urls import path

from .views import (
    PaymentListView,
    PaymentDetailView,
)


urlpatterns = [
    path(
        '',
        PaymentListView.as_view(),
        name='payment-list',
    ),

    path(
        '<int:pk>/',
        PaymentDetailView.as_view(),
        name='payment-detail',
    ),
]