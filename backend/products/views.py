from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .permissions import IsAdminOrReadOnly


# =========================================
# CATEGORY LIST + CREATE
# =========================================

class CategoryListCreateView(generics.ListCreateAPIView):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


# =========================================
# PRODUCT LIST + CREATE
# =========================================

class ProductListCreateView(generics.ListCreateAPIView):

    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    # =========================================
    # FILTER FIELDS
    # =========================================

    filterset_fields = [
        "category",
        "gender",
        "brand",
        "variants__color",
    ]

    # =========================================
    # SEARCH FIELDS
    # =========================================

    search_fields = [
        "name",
        "description",
        "brand",
        "category__name",
        "variants__color",
    ]

    # =========================================
    # ORDERING FIELDS
    # =========================================

    ordering_fields = [
        "price",
        "created_at",
        "name",
        "discount_percent",
    ]

    ordering = [
        "-created_at",
    ]

    # =========================================
    # QUERYSET
    # =========================================

    def get_queryset(self):

        queryset = (
            Product.objects
            .filter(is_active=True)
            .prefetch_related("variants")
            .select_related("category")
            .distinct()
        )

        # =====================================
        # PRICE FILTER
        # =====================================

        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if min_price:
            queryset = queryset.filter(
                price__gte=min_price
            )

        if max_price:
            queryset = queryset.filter(
                price__lte=max_price
            )

        # =====================================
        # DISCOUNT FILTER
        # =====================================

        min_discount = self.request.query_params.get(
            "min_discount"
        )

        if min_discount:
            queryset = queryset.filter(
                discount_percent__gte=min_discount
            )

        return queryset


# =========================================
# PRODUCT DETAIL
# =========================================

class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    queryset = (
        Product.objects
        .select_related("category")
        .prefetch_related("variants")
        .filter(is_active=True)
    )
