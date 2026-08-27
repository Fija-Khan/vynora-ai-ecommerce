from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .permissions import IsAdminOrReadOnly


class CategoryListCreateView(generics.ListCreateAPIView):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductListCreateView(generics.ListCreateAPIView):

    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "category",
        "gender",
        "brand",
        "variants__color",
    ]

    search_fields = [
        "name",
        "description",
        "brand",
        "category__name",
        "variants__color",
    ]

    ordering_fields = [
        "price",
        "created_at",
        "name",
        "discount_percent",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):

        queryset = Product.objects.filter(
            is_active=True
        ).distinct()

        # -----------------------------
        # PRICE FILTER
        # -----------------------------

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

        # -----------------------------
        # DISCOUNT FILTER
        # -----------------------------

        min_discount = self.request.query_params.get(
            "min_discount"
        )

        if min_discount:
            queryset = queryset.filter(
                discount_percent__gte=min_discount
            )

        return queryset


class ProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]