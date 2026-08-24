from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'product',
        'rating',
        'is_approved',
        'created_at',
    )

    list_filter = (
        'rating',
        'is_approved',
        'created_at',
    )

    search_fields = (
        'user__username',
        'user__email',
        'product__name',
        'comment',
    )