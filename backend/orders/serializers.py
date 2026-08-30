from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "price",
        ]

        read_only_fields = [
            "id",
            "product_name",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "user",
            "items",
            "total_amount",
            "status",
            "payment_status",
            "shipping_address",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "total_amount",
            "status",
            "payment_status",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):

        items_data = validated_data.pop("items")

        order = Order.objects.create(
            user=self.context["request"].user,
            **validated_data
        )

        total_amount = 0

        for item_data in items_data:

            product = item_data["product"]
            quantity = item_data["quantity"]

            price = product.price

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )

            total_amount += price * quantity

        order.total_amount = total_amount

        order.save(
            update_fields=["total_amount"]
        )

        return order
