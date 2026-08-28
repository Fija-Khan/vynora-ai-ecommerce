from django.db import models
from django.utils.text import slugify


class Category(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        unique=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):

    GENDER_CHOICES = [
        ("men", "Men"),
        ("women", "Women"),
        ("kids", "Kids"),
    ]

    FIT_CHOICES = [
        ("regular", "Regular Fit"),
        ("slim", "Slim Fit"),
        ("relaxed", "Relaxed Fit"),
        ("oversized", "Oversized"),
    ]

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    brand = models.CharField(
        max_length=100,
        blank=True
    )

    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        default="women"
    )

    name = models.CharField(
        max_length=200
    )

    slug = models.SlugField(
        unique=True,
        blank=True
    )

    description = models.TextField()

    # Pricing
    mrp = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    discount_percent = models.PositiveIntegerField(
        default=0
    )

    # Product information
    fit = models.CharField(
        max_length=30,
        choices=FIT_CHOICES,
        blank=True
    )

    brand_fit = models.CharField(
        max_length=50,
        blank=True
    )

    material = models.CharField(
        max_length=150,
        blank=True
    )

    care = models.CharField(
        max_length=200,
        blank=True
    )

    sleeve_length = models.CharField(
        max_length=100,
        blank=True
    )

    collar = models.CharField(
        max_length=100,
        blank=True
    )

    length = models.CharField(
        max_length=100,
        blank=True
    )

    hemline = models.CharField(
        max_length=100,
        blank=True
    )

    placket = models.CharField(
        max_length=100,
        blank=True
    )

    placket_length = models.CharField(
        max_length=100,
        blank=True
    )

    # Product code
    product_code = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True
    )

    # Stock
    stock = models.PositiveIntegerField(
        default=0
    )

    # Main image
    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True
    )

    # Seller
    seller = models.CharField(
        max_length=150,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductVariant(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants"
    )

    color = models.CharField(
        max_length=50,
        blank=True
    )

    size = models.CharField(
        max_length=50,
        blank=True
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    image = models.ImageField(
        upload_to="products/variants/",
        blank=True,
        null=True
    )

    def __str__(self):

        variant = self.product.name

        if self.color:
            variant += f" - {self.color}"

        if self.size:
            variant += f" - {self.size}"

        return variant