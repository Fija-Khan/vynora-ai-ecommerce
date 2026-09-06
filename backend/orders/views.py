from django.utils import timezone

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save()


class OrderDetailView(generics.RetrieveAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
        )


class CancelOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            order = Order.objects.get(
                id=pk,
                user=request.user
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "error": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status == "cancelled":

            return Response(
                {
                    "error": "Order is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.status in ["shipped", "delivered"]:

            return Response(
                {
                    "error": "Order cannot be cancelled at this stage."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = "cancelled"

        order.save(
            update_fields=[
                "status",
                "updated_at"
            ]
        )

        return Response(
            {
                "message": "Order cancelled successfully.",
                "order_id": order.id,
                "status": order.status
            },
            status=status.HTTP_200_OK
        )


class ReturnOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            order = Order.objects.get(
                id=pk,
                user=request.user
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "error": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Only delivered orders can be returned
        if order.status != "delivered":

            return Response(
                {
                    "error": "Only delivered orders can be returned."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if return already requested
        if order.return_requested:

            return Response(
                {
                    "error": "Return has already been requested for this order."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get return reason
        reason = request.data.get("reason")

        if not reason or not reason.strip():

            return Response(
                {
                    "error": "Return reason is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save return request
        order.return_requested = True
        order.return_reason = reason.strip()
        order.return_requested_at = timezone.now()

        order.save(
            update_fields=[
                "return_requested",
                "return_reason",
                "return_requested_at",
                "updated_at"
            ]
        )

        return Response(
            {
                "message": "Return request submitted successfully.",
                "order_id": order.id,
                "return_requested": order.return_requested,
                "return_reason": order.return_reason,
                "return_requested_at": order.return_requested_at,
            },
            status=status.HTTP_200_OK
        )
