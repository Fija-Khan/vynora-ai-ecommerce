from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    order_total = serializers.DecimalField(
        source='order.total_amount',
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            'id',
            'order',
            'user',
            'amount',
            'order_total',
            'payment_method',
            'transaction_id',
            'status',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'user',
            'amount',
            'order_total',
            'transaction_id',
            'status',
            'created_at',
            'updated_at',
        ]