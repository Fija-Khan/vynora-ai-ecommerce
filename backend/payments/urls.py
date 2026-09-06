from django.urls import path

from .views import (
    PaymentListView,
    PaymentDetailView,
    CreatePaymentView,
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

    path(
        'create/',
        CreatePaymentView.as_view(),
        name='create-payment',
    ),
]
