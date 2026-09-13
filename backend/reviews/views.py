from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Review
from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.filter(
            is_approved=True
        )

        product_id = self.request.query_params.get(
            'product'
        )

        if product_id:
            queryset = queryset.filter(
                product_id=product_id
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Review.objects.filter(
            user=self.request.user
        )

    def perform_update(self, serializer):
        serializer.save()