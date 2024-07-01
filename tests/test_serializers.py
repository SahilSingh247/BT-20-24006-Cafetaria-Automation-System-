from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import serializers
from CafeApp.models import Profile, canteen, customer, items, orders, feedback
from CafeApp.serializers import (
    UserSerializer,
    MenuItemSerializer,
    OrderSerializer,
    AccountDetailsSerializer,
    CanteenSerializer,
    feedbackserializer,
    OrderDetailSerializer,
    ALLCanteenSerializer,
    NewItemSerializer,
)


class SerializerTestCase(TestCase):
    def setUp(self):
        # Create test data for the models
        self.user = User.objects.create(username="testuser")
        self.profile = Profile.objects.create(
            user=self.user,
            type="Customer",
            name="Test Customer",
            contact_number="1234567890",
        )
        self.canteen_owner_profile = Profile.objects.create(
            user=User.objects.create(username="canteen_owner"),
            type="Canteen",
            name="Canteen Owner",
        )
        self.canteen = canteen.objects.create(owner=self.canteen_owner_profile)
        self.customer = customer.objects.create(cust=self.profile)
        self.item = items.objects.create(
            canteen=self.canteen,
            name="Test Item",
            desc="Test Description",
            price=10,
            available=True,
        )
        self.order = orders.objects.create(
            order_cust=self.customer,
            order_canteen=self.canteen,
            total_amount=10,
            status="AddedToCart",
        )
        self.feedback = feedback.objects.create(
            order_id=self.order, review="Test Review", rating=5
        )

    def test_menu_item_serializer(self):
        serializer = MenuItemSerializer(instance=self.item)
        self.assertEqual(serializer.data["name"], "Test Item")

    def test_order_serializer(self):
        serializer = OrderSerializer(instance=self.order)
        self.assertEqual(serializer.data["order_cust_name"], "Test Customer")

    def test_account_details_serializer(self):
        serializer = AccountDetailsSerializer(instance=self.profile)
        self.assertEqual(serializer.data["name"], "Test Customer")

    def test_canteen_serializer(self):
        serializer = CanteenSerializer(instance=self.canteen)
        self.assertEqual(serializer.data["canteen_name"], "Canteen Owner")

    def test_feedback_serializer(self):
        serializer = feedbackserializer(instance=self.feedback)
        self.assertEqual(serializer.data["review"], "Test Review")

    def test_order_detail_serializer(self):
        serializer = OrderDetailSerializer(instance=self.order)
        self.assertEqual(serializer.data["total_amount"], 10)

    def test_all_canteen_serializer(self):
        serializer = ALLCanteenSerializer(instance=self.canteen)
        self.assertEqual(serializer.data["canteen_user_email"], "canteen_owner")

    def test_new_item_serializer(self):
        serializer = NewItemSerializer(instance=self.item)
        self.assertEqual(serializer.data["canteen"], "Canteen Owner")

    def test_invalid_user_serializer(self):
        invalid_data = {"username": "testuser"}
        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())

    def test_account_details_serializer_partial_update(self):
        data = {"contact_number": "9876543210"}
        serializer = AccountDetailsSerializer(
            instance=self.profile, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        profile_instance = serializer.save()
        self.assertEqual(profile_instance.contact_number, "9876543210")

    def test_invalid_new_item_serializer(self):
        invalid_data = {"canteen": "InvalidCanteenName"}
        serializer = NewItemSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
