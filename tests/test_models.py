from django.test import TestCase
from django.contrib.auth.models import User
from CafeApp.models import (
    Profile,
    canteen,
    customer,
    items,
    orders,
    orderquantity,
    feedback,
)


class ModelsTestCase(TestCase):
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
        self.order_quantity = orderquantity.objects.create(
            order_id=self.order, item_id=self.item, quantity=2
        )
        self.default_order_quantity = orderquantity.objects.create(
            order_id=self.order, item_id=self.item
        )

    def test_profile_model(self):
        self.assertEqual(str(self.profile), "Test Customer")

    def test_canteen_model(self):
        self.assertEqual(str(self.canteen), "Canteen Owner")
        self.assertEqual(self.canteen.owner, self.canteen_owner_profile)

    def test_customer_model(self):
        self.assertEqual(str(self.customer), "Test Customer")
        self.assertEqual(self.customer.cust, self.profile)

    def test_items_model(self):
        self.assertEqual(str(self.item), "Test Item")
        self.assertEqual(self.item.canteen, self.canteen)

    def test_orders_model(self):
        self.assertEqual(str(self.order), str(self.order.id))
        self.assertEqual(self.order.order_cust, self.customer)

    def test_orderquantity_model(self):
        self.assertEqual(self.order_quantity.order_id, self.order)
        self.assertEqual(self.order_quantity.item_id, self.item)

    def test_order_status_choices(self):
        valid_statuses = [
            status[0] for status in orders._meta.get_field("status").choices
        ]
        self.assertIn(self.order.status, valid_statuses)

    def test_order_date_default(self):
        self.assertIsNotNone(self.order.date)

    def test_items_available_default(self):
        self.assertTrue(self.item.available)

    def test_orderquantity_default_quantity(self):
        default_quantity_order_quantity = orderquantity._meta.get_field(
            "quantity"
        ).default
        self.assertEqual(
            self.default_order_quantity.quantity, default_quantity_order_quantity
        )
