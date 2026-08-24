from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

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