from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from products.serializers import ProductSerializer

from .models import UserProductInteraction
from .serializers import UserProductInteractionSerializer


class UserProductInteractionListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = UserProductInteractionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProductInteraction.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class UserProductInteractionDetailView(
    generics.RetrieveAPIView
):
    serializer_class = UserProductInteractionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProductInteraction.objects.filter(
            user=self.request.user
        )


class ProductRecommendationView(APIView):

    def get(self, request):
        product_id = request.query_params.get('product')

        if not product_id:
            return Response(
                {
                    'detail': 'Product ID is required.'
                },
                status=400
            )

        try:
            product = Product.objects.get(
                id=product_id
            )
        except Product.DoesNotExist:
            return Response(
                {
                    'detail': 'Product not found.'
                },
                status=404
            )

        recommendations = Product.objects.filter(
            category=product.category
        ).exclude(
            id=product.id
        )[:8]

        serializer = ProductSerializer(
            recommendations,
            many=True
        )

        return Response(serializer.data)