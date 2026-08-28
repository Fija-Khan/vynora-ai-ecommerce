from decimal import Decimal

from rest_framework import serializers

from .models import Category, Product, ProductVariant


# =========================================
# CATEGORY SERIALIZER
# =========================================

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "created_at",
        ]


# =========================================
# PRODUCT VARIANT SERIALIZER
# =========================================

class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "color",
            "size",
            "stock",
        ]


# =========================================
# PRODUCT SERIALIZER
# =========================================

class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    selling_price = serializers.SerializerMethodField()
    mrp = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()

    class Meta:
        model = Product

        fields = [
            # Basic Information
            "id",
            "category",
            "category_name",
            "brand",
            "gender",
            "name",
            "slug",
            "description",

            # Pricing
            "price",
            "selling_price",
            "mrp",
            "discount_percent",
            "discount_amount",

            # Stock
            "stock",
            "stock_status",

            # Image
            "image",

            # Status
            "is_active",

            # Dates
            "created_at",
            "updated_at",

            # Variants
            "variants",
            "available_colors",
            "available_sizes",
        ]

    # =========================================
    # SELLING PRICE
    # =========================================

    def get_selling_price(self, obj):
        return obj.price

    # =========================================
    # MRP
    # =========================================

    def get_mrp(self, obj):

        discount = Decimal(str(obj.discount_percent))

        if discount <= 0:
            return obj.price

        hundred = Decimal("100")

        mrp = obj.price / (
            Decimal("1") - (discount / hundred)
        )

        return mrp.quantize(Decimal("0.01"))

    # =========================================
    # DISCOUNT AMOUNT
    # =========================================

    def get_discount_amount(self, obj):

        discount = Decimal(str(obj.discount_percent))

        if discount <= 0:
            return Decimal("0.00")

        hundred = Decimal("100")

        mrp = obj.price / (
            Decimal("1") - (discount / hundred)
        )

        discount_amount = mrp - obj.price

        return discount_amount.quantize(
            Decimal("0.01")
        )

    # =========================================
    # STOCK STATUS
    # =========================================

    def get_stock_status(self, obj):

        if obj.stock <= 0:
            return "Out of Stock"

        if obj.stock <= 5:
            return "Only Few Left"

        return "In Stock"

    # =========================================
    # AVAILABLE COLORS
    # =========================================

    def get_available_colors(self, obj):

        colors = (
            obj.variants
            .exclude(color="")
            .values_list("color", flat=True)
            .distinct()
        )

        return list(colors)

    # =========================================
    # AVAILABLE SIZES
    # =========================================

    def get_available_sizes(self, obj):

        sizes = (
            obj.variants
            .exclude(size="")
            .values_list("size", flat=True)
            .distinct()
        )

        return list(sizes)
