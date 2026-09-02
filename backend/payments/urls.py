from django.urls import path

from .views import (
    PaymentListView,
    PaymentDetailView,
    CreateRazorpayOrderView,
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
        'create-razorpay-order/',
        CreateRazorpayOrderView.as_view(),
        name='create-razorpay-order',
    ),
]
