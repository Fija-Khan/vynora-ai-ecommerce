from django.contrib import admin
from .models import Category, Product, ProductVariant


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "created_at")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "brand",
        "category",
        "gender",
        "mrp",
        "price",
        "discount_percent",
        "stock",
        "is_active",
    )

    list_filter = (
        "gender",
        "category",
        "is_active",
        "fit",
    )

    search_fields = (
        "name",
        "brand",
        "product_code",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    inlines = [ProductVariantInline]

    fieldsets = (

        (
            "Basic Information",
            {
                "fields": (
                    "name",
                    "brand",
                    "category",
                    "gender",
                    "slug",
                    "description",
                    "image",
                )
            },
        ),

        (
            "Pricing",
            {
                "fields": (
                    "mrp",
                    "price",
                    "discount_percent",
                )
            },
        ),

        (
            "Product Details",
            {
                "fields": (
                    "fit",
                    "brand_fit",
                    "material",
                    "care",
                )
            },
        ),

        (
            "Specifications",
            {
                "fields": (
                    "sleeve_length",
                    "collar",
                    "length",
                    "hemline",
                    "placket",
                    "placket_length",
                )
            },
        ),

        (
            "Inventory",
            {
                "fields": (
                    "stock",
                    "product_code",
                )
            },
        ),

        (
            "Seller",
            {
                "fields": (
                    "seller",
                )
            },
        ),

        (
            "Status",
            {
                "fields": (
                    "is_active",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "product",
        "color",
        "size",
        "stock",
    )

    list_filter = (
        "color",
        "size",
    )

    search_fields = (
        "product__name",
        "color",
        "size",
    )