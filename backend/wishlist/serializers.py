from rest_framework import serializers

from .models import Wishlist, WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    # Product Image
    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )

    class Meta:
        model = WishlistItem

        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "created_at",
        ]

        read_only_fields = [
            "created_at",
            "product_image",
        ]


class WishlistSerializer(serializers.ModelSerializer):

    items = WishlistItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Wishlist

        fields = [
            "id",
            "user",
            "items",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "user",
            "items",
            "created_at",
            "updated_at",
        ]
