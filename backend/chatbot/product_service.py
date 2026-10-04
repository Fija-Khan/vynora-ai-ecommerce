from decimal import Decimal, InvalidOperation

from products.models import Product


def search_products(criteria):
    """
    Search active Vynora products based on AI-generated criteria.
    """

    queryset = (
        Product.objects
        .filter(is_active=True)
        .select_related("category")
        .prefetch_related("variants")
        .distinct()
    )

    # Gender
    gender = criteria.get("gender")
    if gender:
        queryset = queryset.filter(
            gender__iexact=gender
        )

    # Category
    category = criteria.get("category")
    if category:
        queryset = queryset.filter(
            category__name__icontains=category
        )

    # Brand
    brand = criteria.get("brand")
    if brand:
        queryset = queryset.filter(
            brand__icontains=brand
        )

    # Color
    color = criteria.get("color")
    if color:
        queryset = queryset.filter(
            variants__color__icontains=color
        )

    # Maximum price
    max_price = criteria.get("max_price")
    if max_price:
        try:
            max_price = Decimal(str(max_price))
            queryset = queryset.filter(
                price__lte=max_price
            )
        except (InvalidOperation, ValueError):
            pass

    # Minimum price
    min_price = criteria.get("min_price")
    if min_price:
        try:
            min_price = Decimal(str(min_price))
            queryset = queryset.filter(
                price__gte=min_price
            )
        except (InvalidOperation, ValueError):
            pass

    # Minimum discount
    min_discount = criteria.get("min_discount")
    if min_discount:
        try:
            queryset = queryset.filter(
                discount_percent__gte=int(min_discount)
            )
        except (ValueError, TypeError):
            pass

    # Limit results
    return queryset[:6]