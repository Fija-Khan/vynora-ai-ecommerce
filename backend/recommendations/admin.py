from django.contrib import admin

from .models import UserProductInteraction


@admin.register(UserProductInteraction)
class UserProductInteractionAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'product',
        'interaction_type',
        'created_at',
    )

    list_filter = (
        'interaction_type',
        'created_at',
    )

    search_fields = (
        'user__username',
        'user__email',
        'product__name',
    )