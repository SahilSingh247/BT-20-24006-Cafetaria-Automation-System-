# Generated by Django 5.0.6 on 2024-06-22 19:38

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CafeApp', '0015_alter_orders_date_alter_profile_type_supervisor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='rating',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='orders',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2024, 6, 23, 1, 8, 24, 688918)),
        ),
    ]