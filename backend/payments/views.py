from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order


class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            user=self.request.user
        ).select_related('order').order_by('-created_at')


class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            user=self.request.user
        ).select_related('order')


class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_method = request.data.get('payment_method')

        if not order_id:
            return Response(
                {
                    'error': 'order_id is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if payment_method not in ['cod', 'online']:
            return Response(
                {
                    'error': 'Invalid payment method.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order = get_object_or_404(
            Order,
            id=order_id,
            user=request.user
        )

        if Payment.objects.filter(order=order).exists():
            payment = Payment.objects.get(order=order)

            return Response(
                {
                    'message': 'Payment already exists.',
                    'payment': PaymentSerializer(payment).data
                },
                status=status.HTTP_200_OK
            )

        payment_status = 'pending'

        if payment_method == 'cod':
            payment_status = 'pending'

        elif payment_method == 'online':
            payment_status = 'success'

        payment = Payment.objects.create(
            order=order,
            user=request.user,
            amount=order.total_amount,
            payment_method=payment_method,
            status=payment_status
        )

        if payment_method == 'online':
            order.payment_status = 'paid'
        else:
            order.payment_status = 'pending'

        order.save(update_fields=['payment_status'])

        return Response(
            {
                'message': 'Payment created successfully.',
                'payment': PaymentSerializer(payment).data
            },
            status=status.HTTP_201_CREATED
        )