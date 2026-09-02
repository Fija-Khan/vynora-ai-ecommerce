import razorpay

from django.conf import settings

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
        )


class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            user=self.request.user
        )


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')

        if not order_id:
            return Response(
                {
                    'error': 'order_id is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.get(
                id=order_id,
                user=request.user
            )
        except Order.DoesNotExist:
            return Response(
                {
                    'error': 'Order not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Prevent duplicate Razorpay orders
        existing_payment = Payment.objects.filter(
            order=order
        ).first()

        if existing_payment and existing_payment.razorpay_order_id:
            return Response(
                {
                    'message': 'Razorpay order already exists.',
                    'payment_id': existing_payment.id,
                    'razorpay_order_id': existing_payment.razorpay_order_id,
                    'amount': str(existing_payment.amount),
                    'currency': 'INR'
                },
                status=status.HTTP_200_OK
            )

        amount = order.total_amount

        if amount <= 0:
            return Response(
                {
                    'error': 'Order amount must be greater than zero.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        razorpay_order = client.order.create(
            {
                'amount': int(amount * 100),
                'currency': 'INR',
                'receipt': f'order_{order.id}',
                'payment_capture': 1
            }
        )

        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                'user': request.user,
                'amount': amount,
                'payment_method': 'razorpay',
                'razorpay_order_id': razorpay_order['id'],
                'status': 'pending'
            }
        )

        if not created:
            payment.user = request.user
            payment.amount = amount
            payment.payment_method = 'razorpay'
            payment.razorpay_order_id = razorpay_order['id']
            payment.status = 'pending'
            payment.save()

        return Response(
            {
                'message': 'Razorpay order created successfully.',
                'payment_id': payment.id,
                'razorpay_order_id': razorpay_order['id'],
                'amount': str(amount),
                'amount_in_paise': razorpay_order['amount'],
                'currency': razorpay_order['currency'],
                'razorpay_key_id': settings.RAZORPAY_KEY_ID
            },
            status=status.HTTP_201_CREATED
        )
