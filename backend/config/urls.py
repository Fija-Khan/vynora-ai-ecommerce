from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/accounts/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/chatbot/', include('chatbot.urls')),

    # JWT Token Refresh
    path(
        'api/accounts/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
]


urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
