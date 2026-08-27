from rest_framework import serializers

from .models import Category, Product, ProductVariant


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "created_at",
        ]


class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "color",
            "size",
            "stock",
        ]


class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "category",
            "category_name",

            "brand",
            "gender",

            "name",
            "slug",
            "description",

            "price",
            "discount_percent",

            "stock",
            "image",
            "is_active",

            "created_at",
            "updated_at",

            "variants",
        ]