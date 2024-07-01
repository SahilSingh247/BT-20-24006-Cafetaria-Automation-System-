from django.db import models
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import BlacklistedToken
from datetime import datetime
class CustomBlacklistedToken(BlacklistedToken):
    pass

# Create your models here.
# from django.contrib.auth.models import AbstractUser

# class User(AbstractUser):
#     type  = models.CharField(max_length=100,choices=(('Canteen','Canteen'),('Customer','Customer')))

#     class Meta:
#         db_table = 'auth_user'

class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    type  = models.CharField(max_length=100,choices=(('Canteen','Canteen'),('Customer','Customer'),('Supervisor','Supervisor')))
    name = models.CharField(max_length=20)
    contact_number = models.CharField(max_length=12, null=True)
    def __str__(self):
        return self.name




class canteen(models.Model):
    owner = models.OneToOneField(Profile,null=True,on_delete=models.CASCADE)
    canteen_id = models.AutoField(primary_key=True)
    is_verified=models.BooleanField(default=False)
    def __str__(self):
        return self.owner.name


class customer(models.Model):
    cust = models.OneToOneField(Profile,null=True,on_delete=models.CASCADE)
    customer_id = models.AutoField(primary_key=True)
    def __str__(self):
        return self.cust.name
    
class supervisor(models.Model):
    supervis = models.OneToOneField(Profile,null=True,on_delete=models.CASCADE)
    supervisor_id = models.AutoField(primary_key=True)
    def __str__(self):
        return self.supervis.name


class items(models.Model):
    canteen = models.ForeignKey(canteen,on_delete=models.CASCADE,blank=True,null=True)
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25)
    desc = models.TextField()
    price = models.IntegerField(null=False)
    available=models.BooleanField(default=True)
    def __str__(self):
        return self.name
    
class orders(models.Model):
    order_cust = models.ForeignKey(customer,null=True,on_delete=models.CASCADE)
    order_canteen = models.ForeignKey(canteen,null=True,on_delete=models.CASCADE)
    id = models.AutoField(primary_key=True)
    items = models.ManyToManyField(items,related_name="order_item",default=None,blank=False)
    total_amount = models.IntegerField(default=0)
    date = models.DateTimeField(default=datetime.now(), blank=True)
    status = models.CharField(max_length=100,choices=(('PaymentLeft','PaymentLeft'),('Received','Received'),('InProgress','InProgress'), ('Delivered','Delivered'),('AddedToCart','AddedToCart')),null=True)
    def __str__(self):
        return str(self.id)
    
class orderquantity(models.Model):
    order_id=models.ForeignKey(orders,null=False,on_delete=models.CASCADE)
    item_id=models.ForeignKey(items,null=False,on_delete=models.CASCADE)
    quantity=models.IntegerField(default=1,null=False)

class feedback(models.Model):
    RATING_CHOICES = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )
    order_id = models.ForeignKey(orders,null=False,on_delete=models.CASCADE)
    review = models.TextField(max_length=200)
    rating = models.IntegerField(null=True)
