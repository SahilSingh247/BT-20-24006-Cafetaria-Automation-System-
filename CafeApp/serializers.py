from rest_framework import serializers
from .models import *
from django.conf import settings

# serialize or deserialize user datasets


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, data):
        return User.objects.create_user(**data)

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = items
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    order_cust_name = serializers.CharField(source='order_cust.cust.name')
    order_cust_contact = serializers.CharField(source='order_cust.cust.contact_number')
    order_cust_email = serializers.CharField(source='order_cust.cust.user.email')
    order_canteen_name = serializers.CharField(source='order_canteen.owner.name')
    items = MenuItemSerializer(many=True)
    class Meta:
        model = orders
        fields = ('id','order_cust_name','order_cust_contact','order_cust_email','order_canteen_name','total_amount','items','status','date')

class AccountDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields = '__all__'

class CanteenSerializer(serializers.ModelSerializer):
    canteen_name = serializers.CharField(source='owner.name', read_only=True)
    class Meta:
        model=canteen
        fields = ('canteen_name','canteen_id')

class feedbackserializer(serializers.ModelSerializer):
    #order_id=OrderSerializer()
    class Meta:
        model=feedback
        fields = ('order_id','review','rating')

class OrderDetailSerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True)
    class Meta:
        model = orders
        fields = ('id','total_amount','items','status')

class ALLCanteenSerializer(serializers.ModelSerializer):
    canteen_user_email  = serializers.CharField(source='owner.user.username', read_only=True)
    class Meta:
        model=canteen
        fields = ('canteen_user_email','canteen_id')

class NewItemSerializer(serializers.ModelSerializer):
    canteen=serializers.CharField(source='canteen.owner.name')
    class Meta:
        model = items
        fields = '__all__'