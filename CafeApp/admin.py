from django.contrib import admin
from .models import *

class Canteenadmin(admin.ModelAdmin):
    list_display=('canteen_id','owner')

class Custadmin(admin.ModelAdmin):
    list_display=('cust','customer_id')

class itemadmin(admin.ModelAdmin):
    list_display=('id','canteen','name','desc','price')

class ordersadmin(admin.ModelAdmin):
    list_display=('id','order_cust','total_amount')

admin.site.register(canteen,Canteenadmin)
admin.site.register(customer,Custadmin)
admin.site.register(items,itemadmin)
admin.site.register(orders,ordersadmin)
admin.site.register(Profile)
admin.site.register(orderquantity)
admin.site.register(feedback)
# admin.site.register(User)
# Register your models here.
