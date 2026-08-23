from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    class Meta:
        model = OrderItem

        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'price',
        ]

        read_only_fields = [
            'price',
        ]


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            'id',
            'user',
            'items',
            'total_amount',
            'status',
            'payment_status',
            'shipping_address',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'user',
            'items',
            'total_amount',
            'status',
            'payment_status',
            'created_at',
            'updated_at',
        ]