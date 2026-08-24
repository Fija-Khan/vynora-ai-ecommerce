from rest_framework import serializers

from .models import UserProductInteraction


class UserProductInteractionSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    class Meta:
        model = UserProductInteraction

        fields = [
            'id',
            'user',
            'product',
            'product_name',
            'interaction_type',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'user',
            'product_name',
            'created_at',
        ]