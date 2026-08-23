from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer, WishlistItemSerializer


class WishlistView(generics.RetrieveAPIView):

    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(
            user=self.request.user
        )
        return wishlist


class WishlistItemCreateView(generics.CreateAPIView):

    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        wishlist, created = Wishlist.objects.get_or_create(
            user=self.request.user
        )

        serializer.save(wishlist=wishlist)


class WishlistItemDeleteView(generics.DestroyAPIView):

    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wishlist, created = Wishlist.objects.get_or_create(
            user=self.request.user
        )

        return WishlistItem.objects.filter(
            wishlist=wishlist
        )